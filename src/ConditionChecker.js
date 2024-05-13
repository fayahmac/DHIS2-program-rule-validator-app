import React, { useState, useEffect } from 'react';

const ConditionChecker = () => {
    const [condition, setCondition] = useState('');
    const [isSyntaxCorrect, setIsSyntaxCorrect] = useState(null);

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
        const { value } = event.target;
        setCondition(value);
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
            <h2>Check Condition Syntax</h2>
            <textarea
                value={condition}
                onChange={handleChange} // Trigger syntax check on change
                placeholder="Enter condition here"
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
