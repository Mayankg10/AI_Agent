import { NextRequest, NextResponse } from 'next/server';
import { 
  getChatbotConfigurationByBusinessId, 
  createChatbotConfiguration, 
  updateChatbotConfiguration, 
  deleteChatbotConfiguration 
} from '@/lib/database';

// Default configuration
const defaultConfig = {
  business_name: 'My Business',
  primary_color: '#3b82f6',
  accent_color: '#10b981',
  welcome_message: 'Hello! How can I help you today?',
  placeholder: 'Ask me anything...',
  position: 'bottom-right' as const,
  theme: 'auto' as const,
  size: 'medium' as const,
  logo_url: '',
  custom_css: '',
  max_message_length: 1000,
  rate_limit_per_hour: 100,
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    try {
      const config = await getChatbotConfigurationByBusinessId(businessId);
      return NextResponse.json({
        businessId,
        ...config
      });
    } catch (error) {
      // If no config found, return default config
      console.log('No config found for business, returning default:', businessId);
      return NextResponse.json({
        businessId,
        ...defaultConfig
      });
    }
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, business_name, ...config } = body;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['business_name', 'primary_color', 'welcome_message'];
    for (const field of requiredFields) {
      if (!config[field] && field !== 'business_name') {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    if (!business_name) {
      return NextResponse.json(
        { error: 'business_name is required' },
        { status: 400 }
      );
    }

    // Create the configuration
    const configData = {
      business_id: businessId,
      business_name,
      ...defaultConfig,
      ...config
    };

    const newConfig = await createChatbotConfiguration(configData);

    return NextResponse.json({
      message: 'Configuration saved successfully',
      businessId,
      config: newConfig
    });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, configId, ...config } = body;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Check if configuration exists
    try {
      const existingConfig = await getChatbotConfigurationByBusinessId(businessId);
      
      // Update the configuration
      const updatedConfig = await updateChatbotConfiguration(existingConfig.id, config);

      return NextResponse.json({
        message: 'Configuration updated successfully',
        businessId,
        config: updatedConfig
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Check if configuration exists and delete it
    try {
      const existingConfig = await getChatbotConfigurationByBusinessId(businessId);
      
      // Delete the configuration (soft delete)
      await deleteChatbotConfiguration(existingConfig.id);

      return NextResponse.json({
        message: 'Configuration deleted successfully',
        businessId
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting config:', error);
    return NextResponse.json(
      { error: 'Failed to delete configuration' },
      { status: 500 }
    );
  }
}
