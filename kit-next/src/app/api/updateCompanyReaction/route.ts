import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Get counts per companyId for interests
    const interestCounts = await prisma.interest.groupBy({
      by: ['companyId'],
      _count: {
        _all: true,
      },
    });

    // Get counts per companyId for interns
    const internCounts = await prisma.intern.groupBy({
      by: ['companyId'],
      _count: {
        _all: true,
      },
    });

    // Get counts per companyId for events
    const eventJoinCounts = await prisma.event.groupBy({
      by: ['companyId'],
      _count: {
        _all: true,
      },
    });

    // Create maps from companyId to counts
    const interestCountMap = new Map();
    for (const item of interestCounts) {
      interestCountMap.set(item.companyId, item._count._all);
    }

    const internCountMap = new Map();
    for (const item of internCounts) {
      internCountMap.set(item.companyId, item._count._all);
    }

    const eventJoinCountMap = new Map();
    for (const item of eventJoinCounts) {
      eventJoinCountMap.set(item.companyId, item._count._all);
    }

    // Now get all companyIds
    const companies = await prisma.company.findMany({
      select: { corporateNumber: true },
    });

    // Prepare update operations
    const updateOperations = companies.map((company) => {
      const corporateNumber = company.corporateNumber;

      const interestedCount = interestCountMap.get(corporateNumber) || 0;
      const internCount = internCountMap.get(corporateNumber) || 0;
      const eventJoinCount = eventJoinCountMap.get(corporateNumber) || 0;

      return prisma.company.update({
        where: { corporateNumber },
        data: {
          interestedCount,
          internCount,
          eventJoinCount,
        },
      });
    });

    // Run updates in a transaction
    await prisma.$transaction(updateOperations);

    return NextResponse.json({ message: 'Reaction counts updated successfully' });
  } catch (error) {
    console.error('Error updating reaction counts:', error);
    return NextResponse.json({ error: 'Failed to update reaction counts' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 204, headers: { 'Allow': 'POST' } });
}
