import React, { useState, useEffect } from 'react';

const ConditionChecker = () => {
    const [condition, setCondition] = useState('');
    const [isSyntaxCorrect, setIsSyntaxCorrect] = useState(null);
    const [selectedFunction, setSelectedFunction] = useState('');

    useEffect(() => {
        // Trigger syntax check whenever the condition state changes
        checkSyntax();
    }, [condition]);

    const checkSyntax = () => {
        if (condition.trim() === '') {
            setIsSyntaxCorrect(3); // Expression is empty
        } else {
            try {
                // Custom logic to check the syntax of the condition
                // For simplicity, this example just checks if the condition is a non-empty string
                setIsSyntaxCorrect(2); // Syntax is correct
            } catch (error) {
                setIsSyntaxCorrect(1); // Syntax is incorrect
            }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'condition') {
            setCondition(value);
        } else if (name === 'function') {
            setSelectedFunction(value);
            setCondition(value); // Set the selected function as the condition
        }
    };

    const getSyntaxMessage = () => {
        switch (isSyntaxCorrect) {
            case 1:
                return "Syntax is incorrect!";
            case 2:
                return "Syntax is correct!";
            case 3:
                return "Expression is empty";
            default:
                return "";
        }
    };

    return (
        <div>
            <textarea
                value={condition}
                onChange={handleChange} // Trigger syntax check on change
                placeholder="Enter condition here"
                name="condition"
            />
            {isSyntaxCorrect !== null && (
                <div>
                    <p>{getSyntaxMessage()}</p>
                </div>
            )}
        </div>
    );
};

export default ConditionChecker;
