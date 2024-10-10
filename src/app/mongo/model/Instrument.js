import mongoose, { Schema, model, models } from "mongoose";

const InstrumentSchema = new Schema({
  token: { type: String, required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  expiry: { type: String, required: true },
  strike: { type: String, required: true },
  lotsize: { type: String, required: true },
  instrumenttype: { type: String, required: true },
  exch_seg: { type: String, required: true },
  tick_size: { type: String, required: true },
});
mongoose.models = {};
const InstrumentModal =
  models.Instrument || model("Instrument", InstrumentSchema, "Instrument");

export default InstrumentModal;
