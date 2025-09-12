import z from 'zod';

export const priceCardVariantSchema = z.enum(['basic', 'pro', 'enterprise']);

export const productMetadataSchema = z
  .object({
    price_card_variant: priceCardVariantSchema.optional(),
    generated_images: z.string().optional(),
    image_editor: z.enum(['basic', 'pro']).optional(),
    support_level: z.enum(['email', 'live']).optional(),
    _productName: z.string().optional(),
  })
  .transform((data) => {
    // Default values based on product name if metadata is missing
    const getDefaultValues = (productName?: string) => {
      const name = productName?.toLowerCase() || '';
      if (name.includes('enterprise')) {
        return {
          priceCardVariant: 'enterprise' as const,
          generatedPages: 'unlimited' as const,
          contentOptimization: 'pro' as const,
          supportLevel: 'live' as const,
        };
      } else if (name.includes('professional') || name.includes('pro')) {
        return {
          priceCardVariant: 'pro' as const,
          generatedPages: 'unlimited' as const,
          contentOptimization: 'pro' as const,
          supportLevel: 'email' as const,
        };
      } else {
        return {
          priceCardVariant: 'basic' as const,
          generatedPages: 'unlimited' as const,
          contentOptimization: 'basic' as const,
          supportLevel: 'email' as const,
        };
      }
    };

    const defaults = getDefaultValues(data._productName);

    return {
      priceCardVariant: data.price_card_variant || defaults.priceCardVariant,
      generatedPages: data.generated_images === 'enterprise' 
        ? 'unlimited' 
        : data.generated_images ? parseInt(data.generated_images) : 'unlimited',
      contentOptimization: data.image_editor || defaults.contentOptimization,
      supportLevel: data.support_level || defaults.supportLevel,
    };
  });

export type ProductMetadata = z.infer<typeof productMetadataSchema>;
export type PriceCardVariant = z.infer<typeof priceCardVariantSchema>;
