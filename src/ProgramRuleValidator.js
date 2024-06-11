import React, { useState, useEffect } from 'react';

const DHIS2ProgramRuleValidator = () => {
  const [formData, setFormData] = useState({
    rule: '',
    showExtraInfo: false,
  });
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    // Auto-save (or validate) when formData changes, with a debounce effect
    const handleAutoSave = setTimeout(() => {
      if (formData.rule.trim() !== '') {
        setIsAutoSaving(true);
        // Replace with actual DHIS2 API call to validate the rule
        validateRule(formData.rule).then((result) => {
          setIsAutoSaving(false);
          setValidationResult(result);
        });
      }
    }, 1000);

    // Cleanup the timeout when the component unmounts
    return () => clearTimeout(handleAutoSave);
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      // Automatically determine visibility of the extra info field
      showExtraInfo: name === 'rule' && value.trim() !== '',
    }));
  };

  // Simulated function to validate the rule using DHIS2 API
  const validateRule = async (rule) => {
    try {
      const response = await fetch('https://play.dhis2.org/40.3.0/api/programRules/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:district') // Replace with actual credentials
        },
        body: JSON.stringify({ rule })
      });
      return response.json();
    } catch (error) {
      console.error('Error validating rule:', error);
      return null;
    }
  };

  return (
    <div>
      <label>
        Rule:
        <textarea
          name="rule"
          value={formData.rule}
          onChange={handleChange}
        />
      </label>
      {formData.showExtraInfo && (
        <div>
          <label>
            Extra Info (optional):
            <input type="text" name="extraInfo" />
          </label>
        </div>
      )}
      {isAutoSaving && <div>Validating...</div>}
      {validationResult && <div>Validation Result: {JSON.stringify(validationResult)}</div>}
    </div>
  );
};

export default DHIS2ProgramRuleValidator;