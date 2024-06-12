import React from 'react';

const ProgramRuleAction = ({ 
    actionType, 
    content, 
    data, 
    dataElement, 
    trackedEntityDataValue, 
    programStageSection, 
    trackedEntityAttribute 
}) => {

    const executeAction = () => {
        switch(actionType) {
            case "DISPLAYTEXT":
                displayText();
                break;
            case "DISPLAYKEYVALUEPAIR":
                displayKeyValuePair();
                break;
            case "HIDEFIELD":
                hideField();
                break;
            case "HIDESECTION":
                hideSection();
                break;
            case "ASSIGN":
                assignValue();
                break;
            case "SHOWWARNING":
                showWarning();
                break;
            case "SHOWERROR":
                showError();
                break;
            case "WARNINGONCOMPLETE":
                warningOnComplete();
                break;
            default:
                console.log(`Unknown action type: ${actionType}`);
        }
    };

    const displayText = () => {
        console.log(`Displaying text: ${content}`);
    };

    const displayKeyValuePair = () => {
        console.log(`Displaying key-value pair: ${content}`);
    };

    const hideField = () => {
        if (dataElement) {
            console.log(`Hiding data element: ${dataElement}`);
        } else if (trackedEntityDataValue) {
            console.log(`Hiding tracked entity data value: ${trackedEntityDataValue}`);
        }
        if (content) {
            console.log(`Content: ${content}`);
        }
    };

    const hideSection = () => {
        if (programStageSection) {
            console.log(`Hiding section: ${programStageSection}`);
        } else {
            console.log("Program stage section must be defined for HIDESECTION action.");
        }
    };

    const assignValue = () => {
        if (dataElement || content) {
            if (dataElement) {
                console.log(`Assigning value '${data}' to data element: ${dataElement}`);
            }
            if (content) {
                console.log(`Assigning value '${data}' to variable: ${content}`);
            }
        } else {
            console.log("Either content or dataElement must be defined for ASSIGN action to be effective.");
        }
    };

    const showWarning = () => {
        let message = "Warning: ";
        if (data) {
            message += data;
        }
        if (content) {
            message += ` ${content}`;
        }
        if (dataElement) {
            message += ` (Data Element: ${dataElement})`;
        }
        if (trackedEntityAttribute) {
            message += ` (Tracked Entity Attribute: ${trackedEntityAttribute})`;
        }
        console.log(message);
    };

    const showError = () => {
        let message = "Error: ";
        if (content) {
            message += content;
        }
        if (data) {
            message += ` ${data}`;
        }
        if (dataElement) {
            message += ` (Data Element: ${dataElement})`;
        }
        if (trackedEntityAttribute) {
            message += ` (Tracked Entity Attribute: ${trackedEntityAttribute})`;
        }
        console.log(message);
    };

    const warningOnComplete = () => {
        console.log(`Warning on complete: ${content ? content : 'Complete with caution.'}`);
    };

    return (
        <div>
            <button onClick={executeAction}>Execute Action</button>
        </div>
    );
};

export default ProgramRuleAction;