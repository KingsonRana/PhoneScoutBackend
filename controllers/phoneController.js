import { validateSpecs } from "../utils/validatespecs.js"
import ratePhone from "../utils/phoneScore.js";

export const createPhone = (req, res) => {
    const specs = req.body;
    const { isValid, errors } = validateSpecs(specs);
    if (!isValid) {
        return res.status(400).json({ errors });
    }
    const rating = ratePhone(specs);
    return res.status(200).json({
        rating,
        message: 'Phone specifications received successfully.',
    });
};
