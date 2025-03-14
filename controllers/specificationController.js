import specification from "../models/specifications.js";
import { validateName, validateNumber, validateParameter } from "../utils/validatespecs.js";

export const createSpecification = async (req, res) => {
  try {
    const newSpecification = new specification(req.body);
    await newSpecification.save();
    res.status(201).json({
      message: "Specification created successfully!",
      data: newSpecification,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating specification", error: err.message });
  }
};

export const deleteSpecification = async (req, res) => {
  try {
    const deletedSpecification = await specification.findByIdAndDelete(
      req.params.id
    );

    if (!deletedSpecification) {
      return res.status(404).json({ message: "Specification not found" });
    }

    res.status(200).json({ message: "Specification deleted successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error deleting specification", error: err.message });
  }
};

export const updateSpecification = async (req, res) => {
  try {
    
    const { name, weight } = req.body;
    

   if(!validateName(name)){
    return res.status(400).json({ message: "Invaild Name" });
   }
    if(!validateNumber(weight)){
      return res.status(400).json({ message: "Invalid Weight" });
    }
    const updatedFields = {name,weight};
    const updatedSpecification = await specification.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields }, 
      { new: true }
    );

    if (!updatedSpecification) {
      return res.status(404).json({ message: "Specification not found" });
    }

    res.status(200).json({
      message: "Specification updated successfully"
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating specification", error: err.message });
  }
};

export const getSpecification = async (req, res) => {
  try {
    const foundSpecification = await specification.findById(req.params.id);

    if (!foundSpecification) {
      return res.status(404).json({ message: "Specification not found" });
    }

    res.status(200).json({ data: foundSpecification });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error retrieving specification", error: err.message });
  }
};

export const getAllSpecifications = async (req, res) => {
  try {
  
    const specifications = await specification.find();
    const responseData = specifications.map((spec) => ({
      name: spec.name,
      weight: spec.weight,
      id:spec._id,
      parameters:spec.Parameters.length
    }));
    
    res.status(200).json({ data: responseData });
  } catch (err) {
    
    res
      .status(400)
      .json({ message: "Error retrieving specifications", error: err.message });
  }
};

export const getParameter = async (req,res)=>{
  try{
  const specificationId = req.params.id;
  const specifications = await specification.findById(specificationId);
  console.log(specificationId)
  const responseData = specifications.Parameters;
  res.status(200).json({data:responseData})
  }catch (err) {
    res
      .status(400)
      .json({ message: "Error retrieving specifications", error: err.message });
  }


}

export const addParameter = async (req,res) => {
 try{
   const specificationId = req.params.id;
   const parameter = req.body;
   const validateParameters = validateParameter(parameter);
   if (!validateParameters) {
    return res.status(400).json({ message: "One or more validation failed" });
  }
  const specifications = await specification.findById(specificationId);
  if (!specifications) {
    return res.status(404).json({ message: "Specification not found" });
  }
  console.log(specifications)
  specifications.Parameters.push(parameter);

  const updatedSpecification = await specifications.save();
  res.status(200).json({
    message: "Parameters added successfully",
    data: updatedSpecification,
  });
 }catch(err){
  res
  .status(400)
  .json({ message: "Error adding parameter", error: err.message });
 }
}

export const updateParameter = async (req, res) => {
  try {
    const parameter = req.body;
    console.log(parameter)
    if (!parameter || Object.keys(parameter).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const validateParameters = validateParameter(parameter);
    if (!validateParameters) {
      return res.status(400).json({ message: "One or more validation failed" });
    }

    
    const updatedParameter = await specification.findOneAndUpdate(
      { _id: req.params.id, "Parameters._id": req.body.id}, 
      { $set: { "Parameters.$": parameter } }, 
      { new: true }
    );

    if (!updatedParameter) {
      return res.status(404).json({ message: "Parameter not found" });
    }
    res.status(200).json({
      message: "Parameter updated successfully",
      data: updatedParameter,
    });
  } catch (err) {
    
    res.status(500).json({
      message: "An error occurred while updating the parameter",
      error: err.message,
    });
  }
};

export const deleteParameter = async (req, res) => {
  try {

    const specificationDoc = await specification.findOne({ 
      _id: req.params.id, 
      "Parameters._id": req.body.id 
    });

    if (!specificationDoc) {
      return res.status(400).json({ message: "Parameter not found" });
    }

    const updatedSpecification = await specification.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { Parameters: { _id: req.body.id } } },
      { new: true } 
    );

    res.status(200).json({ message: "Parameter deleted successfully", data: updatedSpecification });
  } catch (err) {
    res.status(500).json({ message: "Error deleting parameter", error: err.message });
  }
};


