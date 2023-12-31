const jwt = require("jsonwebtoken");
import { checkList } from "@/app/(admin)/classes/userClass";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs/promises"
import FormBuilder from "@/app/(admin)/classes/form/FormBuilder";
import Form from "@/app/(admin)/classes/form/Form";

export async function POST(request: NextRequest, response: NextResponse){
    const token = cookies().get('token');
    const decoded = jwt.verify(token?.value, process.env.JWT_SECRET);
    
    const selectedForm  = (await request.json())?.selectedForm as string;
    const editSelectedForm = selectedForm.replace(/ /g, "-");    
    const projectName = (cookies().get('projectName')?.value as string).replace(/-/g," ");
    
    const forms = await checkList.findForms(decoded.userId, projectName); 
     
    const selectForm = forms.find((form: any) => form._name == editSelectedForm)
    
    const formObject =  new FormBuilder().formFromObject(selectForm)
    const roleslist: any[] | undefined = checkList.findRoles(formObject)
    const path = process.cwd() + `/src/app/(admin)/database/${decoded.userId}/${projectName}/${editSelectedForm}/responses.json`;
    
    
    const responseFile = await fs.readFile(path, "utf8")
    .then((responses) => {        
        return JSON.parse(responses);
    })
    .catch((error) => {
        // Handle errors
        console.error('Error reading forms:', error);
        return [];
    });
    if(cookies().get('otherForm')){
        
        const otherForm = cookies().get('otherForm')?.value as string;
        const editOtherForm = otherForm.replace(/-/g, "\\-").replace(/ /g, "-")
        const forms2 = await checkList.findForms(decoded.userId, projectName);
        const selectForm2 = forms2.find((form: any) => form._name == editOtherForm)
        const formObject2 =  new FormBuilder().formFromObject(selectForm2)
        const roleslist2: any[] | undefined = checkList.findRoles(formObject2)
        const path2 = process.cwd() + `/src/app/(admin)/database/${decoded.userId}/${projectName}/${editOtherForm}/responses.json`;
        
        console.log(formObject);
        console.log(formObject2);
        let questionList = formObject.findMatchingQuestions(formObject2)
        console.log(questionList);
        const responseFile2 = await fs.readFile(path2, "utf8")
        .then((responses) => {
            return JSON.parse(responses);
        })
        .catch((error) => {
            // Handle errors
            console.error('Error reading forms:', error);
            return [];
        });

        return new NextResponse(JSON.stringify({
            formdata: {roles: roleslist, selectedForm: editSelectedForm, questions: questionList}, 
            formdata2:{roles: roleslist2, selectedForm: editOtherForm, questions: questionList}, 
            mResponse: responseFile, oResponse: responseFile2}), {status: 200})

    }else{
        return new NextResponse(JSON.stringify({formdata: {roles: roleslist, selectedForm: editSelectedForm, questions: formObject.questions}, mResponse: responseFile}), {status: 200})
    }
} 