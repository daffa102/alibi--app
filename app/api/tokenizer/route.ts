import { NextResponse } from "next/server";
// @ts-expect-error midtrans-client tidak memiliki package @types resmi
import midtransClient from "midtrans-client";

// 1. Inisialisasi Snap Client dari SDK resmi Midtrans
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  try {
    const { plan, userId, userEmail } = await request.json();

    if (!plan || !userId) {
      return NextResponse.json(
        { error: "Plan dan userId wajib disertakan" },
        { status: 400 }
      );
    }

    let grossAmount = 0;
    let itemName = "";

    if (plan === "quota") {
      grossAmount = 9000;
      itemName = "Alibi 3x Emergency Quota";
    } else if (plan === "lifetime") {
      grossAmount = 29000;
      itemName = "Alibi Lifetime Unlimited Access";
    } else {
      return NextResponse.json(
        { error: "Paket tidak valid!" },
        { status: 400 }
      );
    }
    // Deteksi origin dinamis: jika di Vercel pakai domain Vercel, jika lokal pakai localhost
    const origin =
      request.headers.get("origin") ||
      request.headers.get("referer") ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const cleanOrigin = origin.replace(/\/$/, "");

    // 4. Generate Order ID unik
    const orderId = `ALIBI-${plan.toUpperCase()}-${Date.now()}-${userId.slice(0, 5)}`;

    // 5. Susun parameter transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      item_details: [
        {
          id: plan,
          price: grossAmount,
          quantity: 1,
          name: itemName,
        },
      ],
      customer_details: {
        email: userEmail || "customer@alibi.app",
      },

      custom_field1: userId,
      custom_field2: plan,

      // Redirect dinamis mengikuti website tempat user sedang membuka aplikasi
      callbacks: {
        finish: cleanOrigin,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error: unknown) {
    console.error("Midtrans Tokenizer Error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal membuat transaksi Midtrans";
    return NextResponse.json({
      error: errorMessage,
    }, { status: 500 });
  }
}