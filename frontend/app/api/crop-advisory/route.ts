import { NextResponse } from 'next/server';

const CROP_DATA = [
    { name: "Rice", conditions: { N: 80, P: 40, K: 40, temp: 25, humidity: 80, ph: 6.5, rainfall: 200 } },
    { name: "Wheat", conditions: { N: 60, P: 30, K: 30, temp: 20, humidity: 60, ph: 6.5, rainfall: 100 } },
    { name: "Maize", conditions: { N: 70, P: 40, K: 40, temp: 25, humidity: 65, ph: 6.5, rainfall: 150 } },
    { name: "Barley", conditions: { N: 60, P: 30, K: 30, temp: 18, humidity: 50, ph: 6.5, rainfall: 80 } },
    { name: "Millet", conditions: { N: 40, P: 20, K: 20, temp: 28, humidity: 40, ph: 6.5, rainfall: 50 } },
    { name: "Chickpea", conditions: { N: 40, P: 60, K: 30, temp: 20, humidity: 50, ph: 7.0, rainfall: 80 } },
    { name: "Kidney Beans", conditions: { N: 20, P: 60, K: 20, temp: 22, humidity: 55, ph: 6.0, rainfall: 100 } },
    { name: "Pigeon Peas", conditions: { N: 20, P: 60, K: 20, temp: 28, humidity: 60, ph: 6.0, rainfall: 100 } },
    { name: "Moth Beans", conditions: { N: 20, P: 40, K: 20, temp: 28, humidity: 45, ph: 7.0, rainfall: 60 } },
    { name: "Mung Bean", conditions: { N: 20, P: 40, K: 20, temp: 28, humidity: 60, ph: 6.5, rainfall: 75 } },
    { name: "Black Gram", conditions: { N: 40, P: 60, K: 20, temp: 28, humidity: 65, ph: 7.0, rainfall: 70 } },
    { name: "Lentil", conditions: { N: 20, P: 60, K: 20, temp: 20, humidity: 50, ph: 6.5, rainfall: 60 } },
    { name: "Apple", conditions: { N: 100, P: 50, K: 100, temp: 15, humidity: 60, ph: 6.0, rainfall: 100 } },
    { name: "Banana", conditions: { N: 100, P: 75, K: 50, temp: 27, humidity: 80, ph: 6.5, rainfall: 150 } },
    { name: "Mango", conditions: { N: 20, P: 20, K: 30, temp: 30, humidity: 50, ph: 6.0, rainfall: 120 } },
    { name: "Grapes", conditions: { N: 20, P: 120, K: 200, temp: 25, humidity: 60, ph: 6.5, rainfall: 70 } },
    { name: "Watermelon", conditions: { N: 100, P: 10, K: 50, temp: 26, humidity: 50, ph: 6.5, rainfall: 50 } },
    { name: "Muskmelon", conditions: { N: 100, P: 10, K: 50, temp: 28, humidity: 50, ph: 6.5, rainfall: 50 } },
    { name: "Orange", conditions: { N: 20, P: 10, K: 10, temp: 25, humidity: 60, ph: 7.0, rainfall: 110 } },
    { name: "Papaya", conditions: { N: 50, P: 50, K: 50, temp: 28, humidity: 75, ph: 6.5, rainfall: 150 } },
    { name: "Coconut", conditions: { N: 20, P: 10, K: 30, temp: 27, humidity: 80, ph: 6.0, rainfall: 200 } },
    { name: "Pomegranate", conditions: { N: 20, P: 10, K: 40, temp: 25, humidity: 50, ph: 6.5, rainfall: 70 } },
    { name: "Cotton", conditions: { N: 120, P: 40, K: 20, temp: 30, humidity: 50, ph: 7.0, rainfall: 80 } },
    { name: "Jute", conditions: { N: 80, P: 40, K: 40, temp: 30, humidity: 85, ph: 6.5, rainfall: 180 } },
    { name: "Coffee", conditions: { N: 100, P: 20, K: 30, temp: 22, humidity: 80, ph: 6.0, rainfall: 220 } },
    { name: "Tea", conditions: { N: 100, P: 30, K: 30, temp: 20, humidity: 85, ph: 5.5, rainfall: 250 } },
    { name: "Sugarcane", conditions: { N: 100, P: 50, K: 50, temp: 28, humidity: 75, ph: 7.0, rainfall: 180 } },
    { name: "Rubber", conditions: { N: 100, P: 50, K: 50, temp: 28, humidity: 80, ph: 5.5, rainfall: 250 } },
    { name: "Tobacco", conditions: { N: 60, P: 40, K: 40, temp: 25, humidity: 60, ph: 6.0, rainfall: 100 } },
    { name: "Mustard", conditions: { N: 50, P: 25, K: 25, temp: 20, humidity: 55, ph: 7.0, rainfall: 60 } },
    { name: "Pineapple", conditions: { N: 50, P: 20, K: 50, temp: 25, humidity: 75, ph: 5.0, rainfall: 150 } },
    { name: "Strawberry", conditions: { N: 40, P: 20, K: 30, temp: 18, humidity: 65, ph: 6.0, rainfall: 80 } },
    { name: "Guava", conditions: { N: 50, P: 30, K: 30, temp: 26, humidity: 60, ph: 6.5, rainfall: 100 } },
    { name: "Spinach", conditions: { N: 60, P: 20, K: 40, temp: 15, humidity: 60, ph: 6.5, rainfall: 50 } },
    { name: "Broccoli", conditions: { N: 80, P: 30, K: 60, temp: 18, humidity: 70, ph: 6.5, rainfall: 70 } },
    { name: "Cauliflower", conditions: { N: 80, P: 40, K: 60, temp: 18, humidity: 75, ph: 6.5, rainfall: 70 } },
    { name: "Cabbage", conditions: { N: 90, P: 40, K: 60, temp: 18, humidity: 75, ph: 6.5, rainfall: 70 } },
    { name: "Turmeric", conditions: { N: 60, P: 30, K: 60, temp: 25, humidity: 80, ph: 6.0, rainfall: 150 } },
    { name: "Ginger", conditions: { N: 60, P: 30, K: 60, temp: 25, humidity: 80, ph: 6.0, rainfall: 180 } },
    { name: "Garlic", conditions: { N: 50, P: 25, K: 40, temp: 15, humidity: 50, ph: 6.5, rainfall: 60 } },
    { name: "Onion", conditions: { N: 60, P: 30, K: 50, temp: 20, humidity: 60, ph: 6.5, rainfall: 70 } },
    { name: "Sunflower", conditions: { N: 60, P: 40, K: 40, temp: 25, humidity: 50, ph: 7.0, rainfall: 60 } },
];

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const N = parseFloat(data.nitrogen || 0) || 0;
        const P = parseFloat(data.phosphorus || 0) || 0;
        const K = parseFloat(data.potassium || 0) || 0;
        const temp = parseFloat(data.temperature || 0) || 0;
        const humidity = parseFloat(data.humidity || 0) || 0;
        const ph = parseFloat(data.ph || 0) || 0;
        const rainfall = parseFloat(data.rainfall || 0) || 0;

        // Sanity Check for Extreme Conditions
        if (temp > 50 || temp < -10 || ph < 0 || ph > 14 || humidity < 0 || humidity > 100 || rainfall < 0) {
            return NextResponse.json({
                recommended_crops: ["no crop in the whole world can be grown in this condition"],
                reason: "The provided environmental conditions are too extreme for any known crop."
            });
        }

        // Distance-based matching
        const scoredCrops: [string, number][] = [];

        for (const crop of CROP_DATA) {
            const c = crop.conditions;
            let score = 0;
            score += Math.abs(N - c.N) / Math.max(1, c.N);
            score += Math.abs(P - c.P) / Math.max(1, c.P);
            score += Math.abs(K - c.K) / Math.max(1, c.K);
            score += Math.abs(temp - c.temp) / Math.max(1, c.temp);
            score += Math.abs(humidity - c.humidity) / Math.max(1, c.humidity);
            score += Math.abs(ph - c.ph) / Math.max(1, c.ph);
            score += Math.abs(rainfall - c.rainfall) / Math.max(1, c.rainfall);
            scoredCrops.push([crop.name, score]);
        }

        scoredCrops.sort((a, b) => a[1] - b[1]);
        const topCrops = scoredCrops.slice(0, 3).map(([name]) => name);
        const bestCrop = scoredCrops[0][0];

        return NextResponse.json({
            recommended_crops: topCrops,
            reason: `Best suited for current soil nutrients and climate conditions, matching closely with ${bestCrop} requirements.`
        });

    } catch (e) {
        return NextResponse.json({
            recommended_crops: ["Error processing data"],
            reason: "An unexpected error occurred. Please try again."
        }, { status: 500 });
    }
}
