import { NextResponse } from 'next/server';

const CROP_BASE_PRICES_INR: Record<string, number> = {
  'wheat': 2275, 
  'rice': 2183,
  'tomato': 1500,
  'potato': 1200,
  'onion': 1800,
  'sugarcane': 315,
  'cotton': 6620,
  'maize': 2090,
  'soybean': 4600,
  'mustard': 5450,
  'bajra': 2500,
  'jowar': 3180,
  'tur': 7000,
  'moong': 8558,
  'urad': 6950,
  'groundnut': 6377,
  'sunflower': 6760,
  'jute': 5050
};

const EXCHANGE_RATES: Record<string, { rate: number, symbol: string, code: string }> = {
  'usa': { rate: 83.5, symbol: '$', code: 'USD' },
  'uk': { rate: 105.2, symbol: '£', code: 'GBP' },
  'europe': { rate: 90.1, symbol: '€', code: 'EUR' },
  'australia': { rate: 55.4, symbol: 'A$', code: 'AUD' },
  'canada': { rate: 61.2, symbol: 'C$', code: 'CAD' },
  'uae': { rate: 22.7, symbol: 'د.إ', code: 'AED' },
  'china': { rate: 11.5, symbol: '¥', code: 'CNY' },
  'japan': { rate: 0.55, symbol: '¥', code: 'JPY' },
  'russia': { rate: 0.90, symbol: '₽', code: 'RUB' }
};

const TRANSPORT_RATES: Record<string, number> = {
    'tractor': 25.0,     // ₹25 per 100km per quintal
    'small_truck': 35.0, // ₹35 per 100km
    'heavy_truck': 15.0, // ₹15 per 100km
    'train': 8.0         // ₹8 per 100km (cheap bulk)
};

function getDistance(str1: string, str2: string) {
    const s1 = (str1||"").toLowerCase().replace(/\s+/g, '');
    const s2 = (str2||"").toLowerCase().replace(/\s+/g, '');
    let h1 = s1.split('').reduce((a, c) => a + c.charCodeAt(0), 17);
    let h2 = s2.split('').reduce((a, c) => a + c.charCodeAt(0), 31);
    // return deterministic kms between 15km and 900km
    return 15 + (Math.abs(h1 * 41 ^ h2 * 23) % 885);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { cropName, origin, country, destinationRegion, transportMode, exportPort, quality } = body;
        
        cropName = (cropName || '').toLowerCase().trim();
        origin = (origin || '').toLowerCase().trim();
        country = (country || '').toLowerCase().trim();
        destinationRegion = (destinationRegion || '').toLowerCase().trim();
        transportMode = (transportMode || 'small_truck').toLowerCase().trim();
        quality = (quality || 'standard').toLowerCase().trim();

        if (!cropName || !origin || !country) {
            return NextResponse.json({ status: "error", message: "Crop, Origin, and Country are required." }, { status: 400 });
        }

        let basePriceInr = CROP_BASE_PRICES_INR[cropName];
        if (!basePriceInr) {
            let hash = cropName.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
            basePriceInr = 1000 + (Math.abs(hash) % 7000); 
        }

        let qualityMultiplier = 1.0;
        if (quality === 'premium') qualityMultiplier = 1.30;
        if (quality === 'low') qualityMultiplier = 0.85;
        let qualityAdjustedInr = basePriceInr * qualityMultiplier;

        const _countryTarget = country.toLowerCase();
        const tRate = TRANSPORT_RATES[transportMode] || 35.0;

        if (_countryTarget === 'india' || _countryTarget === 'bharat') {
            
            // Domestic Region distances
            const distLocal = getDistance(origin, destinationRegion);
            const distMandi = getDistance(origin, destinationRegion + "mandi");

            // Govt MSP (Fixed rate across India)
            let mspGross = basePriceInr;
            let mspTransport = Math.max(10, (distMandi / 100) * tRate); // Transit Hauling
            let mspNet = mspGross - mspTransport;

            // Open market price fluctuates per destination surplus
            const destHash = destinationRegion.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
            let regionPremium = ((destHash % 40) - 15) / 100; // -15% to +25%
            let openMarketGross = qualityAdjustedInr * (1 + regionPremium);
            
            let openMarketTransport = Math.max(10, (distLocal / 100) * tRate);
            let openMarketNet = openMarketGross - openMarketTransport;

            let recommendation = "";
            if (openMarketNet > mspNet) {
                let diff = openMarketNet - mspNet;
                recommendation = `Selling in the Local Open Market at ${destinationRegion.toUpperCase()} is more profitable by ₹${diff.toFixed(2)}/quintal.`;
            } else {
                let diff = mspNet - openMarketNet;
                recommendation = `Selling to Government Mandis at MSP is more profitable by ₹${diff.toFixed(2)}/quintal.`;
            }

            return NextResponse.json({
                status: "success",
                is_comparison: true,
                message: `Trade Analysis: ${origin.toUpperCase()} ➔ ${destinationRegion.toUpperCase()}`,
                recommendation: recommendation,
                options: {
                    open_market: {
                        gross_price: openMarketGross,
                        distance_km: distLocal,
                        transport_cost: openMarketTransport,
                        net_profit: openMarketNet
                    },
                    govt_msp: {
                        gross_price: mspGross,
                        distance_km: distMandi,
                        transport_cost: mspTransport,
                        net_profit: mspNet
                    }
                }
            });
        } else {
            // International Export
            const currencyInfo = EXCHANGE_RATES[_countryTarget] || { rate: 83.5, symbol: '$', code: 'USD' };
            
            // Raw base price translated to foreign currency
            let baseForeign = qualityAdjustedInr / currencyInfo.rate;
            
            // Export crops sell for significantly more (2.5x markup in foreign markets)
            let grossExportPrice = baseForeign * 2.5; 

            // Costs
            let exportTax = baseForeign * 0.15; // 15% of base value
            
            let internationalShipping = 25.0; 
            if (currencyInfo.code === 'AED') internationalShipping = 15.0;
            if (currencyInfo.code === 'AUD' || currencyInfo.code === 'CAD') internationalShipping = 45.0;
            if (currencyInfo.code === 'EUR' || currencyInfo.code === 'GBP') internationalShipping = 35.0;
            
            // Domestic transit to port
            const portDist = getDistance(origin, exportPort || "nearest port");
            let transitToPortInr = Math.max(50, (portDist / 100) * tRate); 
            let transitToPortForeign = transitToPortInr / currencyInfo.rate;

            // Foreign inland transit (Port to Destination Market)
            const foreignInlandDist = getDistance("port", destinationRegion || "capital");
            // Assuming foreign transit is slightly more expensive per km
            let transitForeignInland = Math.max(10, (foreignInlandDist / 100) * (tRate / currencyInfo.rate) * 3);

            let totalDeductions = exportTax + internationalShipping + transitToPortForeign + transitForeignInland;
            let netProfit = grossExportPrice - totalDeductions;

            return NextResponse.json({
                status: "success",
                is_comparison: false,
                currency: currencyInfo.code,
                symbol: currencyInfo.symbol,
                price: netProfit,
                breakdown: {
                    gross_price: grossExportPrice,
                    export_tax: exportTax,
                    transit_to_port: transitToPortForeign,   
                    international_shipping: internationalShipping,
                    transit_foreign_inland: transitForeignInland,
                    foreign_inland_km: foreignInlandDist,
                    total_deductions: totalDeductions
                },
                message: `Export Net Profit: ${origin.toUpperCase()} ➔ ${destinationRegion ? destinationRegion.toUpperCase() + ', ' : ''}${country.toUpperCase()}`
            });
        }
    } catch (e) {
        return NextResponse.json({ status: "error", message: "Server calculation failed" }, { status: 500 });
    }
}
