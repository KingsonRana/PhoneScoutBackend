import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true, unique:true },
  weight: {
    type: Number,
    required: true,
    min: [1, "Minimum allowed weight is 1"],
    max: [100, "Maximum allowed weight is 100"],
  },
   Parameters :{
    type: [
      {
        name: { type: String, required: true },
        weight: {
          type: Number,
          required: true,
          min: [1, "Minimum allowed weight is 1"],
          max: [100, "Maximum allowed weight is 100"],
        },
        hasArrayValue: { type: Boolean, default: false, required: true },
        hasNumericalValue: { type: Boolean, default: false, required: true },
  
        // Conditionally required arrayValues
        arrayValues: {
          type: [
            {
              name: { type: String, required: true },
              rating: {
                type: Number,
                min: [1, "Minimum allowed rating is 1"],
                max: [100, "Maximum allowed rating is 100"],
              },
            },
          ],
          default: [],
          validate: {
            validator: function (v) {
              if (this.hasArrayValue) {
                return v.length > 0 && new Set(v.map((item) => item.name)).size === v.length;
              }
              return true; 
            },
            message: "Duplicate names in arrayValues are not allowed!",
          },
        },
  
        // Conditionally required numericValues
        numericValues: {
          type: {
            min: { type: Number, required: function () { return this.hasNumericalValue; } },
            max: { type: Number, required: function () { return this.hasNumericalValue; } },
            isInverted: Boolean,
          },
          required: function () { return this.hasNumericalValue; }, // Ensure numericValues is required only when needed
        },
      },
    ],
  }
  
});

const specification = mongoose.model("specification", schema);
export default specification;
