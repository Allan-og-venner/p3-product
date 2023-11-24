import z from "zod"

import Form from "./form";
import Question from "./question";
import { MultipleChoice, Slider } from "./question";
import ValidationError from "../exceptions/ValidationError";

const nameMax : number = 127;
const descMax : number = 1023;



export default class FormValidator {
    static FormTemplate = z.object({
        _name: z.string().min(1, { message: "Name required" })
                        .max(nameMax, { message: "No more than " + nameMax + " characters" })
                        .regex(new RegExp(/^$|^[a-zA-Z0-9 -]+$/),'Special characters not allowed'),
        _description: z.string().max(descMax),
        _questions: z.array(z.object({
            _description: z.string().min(1, { message: "Text required" })
                            .max(descMax, { message: "No more than " + descMax + " characters" }),
            _mandatory: z.boolean(),
            _userDisplay : z.boolean(),
            _questionType : z.number(),
            _number : z.number().optional(),
            _sliderType : z.number().optional(),
            _range : z.number().gte(3).lte(9).refine((data) => data % 2 == 1).optional(),
            _choiceType : z.number().optional(),
            _saveRoles : z.boolean().optional(),
            _options : z.array(z.string().min(1, { message: "Text required" })
            .max(descMax, { message: "No more than " + descMax + " characters" }))
            .optional()
        })),
        _tokens: z.array(z.string()).optional()
    })    

    static nameTemplate = z.string().min(1, { message: "Name required" })
    .max(nameMax, { message: "No more than " + nameMax + " characters" })
    .regex(new RegExp(/^$|^[a-zA-Z0-9 ]+$/),'Special characters not allowed')

    static descTemplate = z.string()
    .max(descMax, { message: "No more than " + descMax + " characters" });

    static questionTemplate = z.string().min(1, { message: "Name required" })
    .max(descMax, { message: "No more than " + descMax + " characters" });

    static optionTemplate = z.string().min(1, { message: "Text required" })
                        .max(descMax, { message: "No more than " + descMax + " characters" });

    static sliderTemplate = z.number().gte(3).lte(9).refine((data) => data % 2 == 1);

    static validateForm(form: Form) : void {
        this.FormTemplate.parse(form)   
    }
}