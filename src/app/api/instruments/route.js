// import InstrumentModal from "@/app/mongo/model/Instrument";
// import InstrumentModal from "@/mongo/model/Instrument";
import InstrumentModal from "../../mongo/model/Instrument";
import connectToDatabase from "../../mongo/db";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto;

export const POST = async (req, content) => {
  await connectToDatabase();
  try {
    const payload = await req.json();
    // await mongoose.connect(connectionStr);
    const data = await InstrumentModal.find({
      name: { $regex: new RegExp(payload?.name, "i") }, // 'i' for case-insensitive
    });
    // ({ name: payload?.name || "" });
    return NextResponse.json({
      status: 200,
      message: "OK",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Failed",
      data: [],
      error,
    });
  }
};
