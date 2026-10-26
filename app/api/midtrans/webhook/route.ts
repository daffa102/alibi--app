import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            order_id,
            status_code,
            gross_amount,
            signature_key,
            transaction_status,
            fraud_status,
            custom_field1: userId,
            custom_field2: plan,
        } = body;

        const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
        const hash = crypto
        .createHash("sha512")

        .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
        .digest("hex");

        if (hash !== signature_key) {
      console.error("Signature Key Midtrans tidak valid!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const isPaymentSuccess =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept");

    if (isPaymentSuccess) {
      if (!userId) {
        console.error("Webhook gagal: UserId tidak ditemukan di custom_field1");
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }

            if (plan === "lifetime") {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ is_lifetime: true })
          .eq("id", userId);

        if (error) {
          console.error("Gagal update lifetime:", error.message);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      } else if (plan === "quota") {
        // Ambil kuota saat ini terlebih dahulu
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("quota")
          .eq("id", userId)
          .single();

        const currentQuota = profile?.quota || 0;

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ quota: currentQuota + 3 })
          .eq("id", userId);

        if (error) {
          console.error("Gagal update kuota:", error.message);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }

      console.log(`Pembayaran sukses untuk Order: ${order_id}, User: ${userId}`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: unknown) {
    console.error("Midtrans Webhook Error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
