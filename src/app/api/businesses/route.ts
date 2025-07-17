import { NextRequest, NextResponse } from 'next/server';
import { getBusinessesByUserId, createBusiness, updateBusiness, deleteBusiness } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const businesses = await getBusinessesByUserId(userId);
    
    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, name, description, website_url, industry } = body;

    if (!user_id || !name) {
      return NextResponse.json(
        { error: 'User ID and business name are required' },
        { status: 400 }
      );
    }

    const businessData = {
      user_id,
      name,
      description: description || null,
      website_url: website_url || null,
      logo_url: null,
      industry: industry || null,
      is_active: true
    };

    const business = await createBusiness(businessData);

    return NextResponse.json({
      success: true,
      business,
      message: 'Business created successfully'
    });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const business = await updateBusiness(id, updates);

    return NextResponse.json({
      success: true,
      business,
      message: 'Business updated successfully'
    });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get('id');

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    await deleteBusiness(businessId);

    return NextResponse.json({
      success: true,
      message: 'Business deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json(
      { error: 'Failed to delete business' },
      { status: 500 }
    );
  }
}
