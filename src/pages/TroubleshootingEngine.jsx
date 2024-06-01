import React, { useState, useEffect } from 'react';
import { BsListCheck } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import { evaluate } from 'mathjs';
import { differenceInYears } from 'date-fns';
import './TroubleshootingEngine.css';

// Classes to handle different types of actions related to program rules
class RuleActionHideField {
  constructor(field) {
    this.field = field;
  }
  needsContent() {
    return !!this.field;
  }
}
class RuleActionHideOption {
  constructor(field, option) {
    this.field = field;
    this.option = option;
  }
  needsContent() {
    return !!this.field && !!this.option;
  }
}
class RuleActionHideOptionGroup {
  constructor(field, optionGroup) {
    this.field = field;
    this.optionGroup = optionGroup;
  }
  needsContent() {
    return !!this.field && !!this.optionGroup;
  }
}
class RuleActionHideProgramStage {
  constructor(programStage) {
    this.programStage = programStage;
  }
  needsContent() {
    return !!this.programStage;
  }
}
class RuleActionHideSection {
  constructor(programStageSection) {
    this.programStageSection = programStageSection;
  }
  needsContent() {
    return !!this.programStageSection;
  }
}
class RuleActionSetMandatoryField {
  constructor(field) {
    this.field = field;
  }
  needsContent() {
    return !!this.field;
  }
}
class RuleActionShowOptionGroup {
  constructor(optionGroup) {
    this.optionGroup = optionGroup;
  }
  needsContent() {
    return !!this.optionGroup;
  }
}

// Query to fetch required data from DHIS2 API
const query = {
  programRules: {
    resource: 'programRules',
    params: { fields: '*,created' }, // Ensure 'created' field is fetched
  },
  programRuleVariables: {
    resource: 'programRuleVariables',
    params: { fields: '*' },
  },
  trackedEntityAttributes: {
    resource: 'trackedEntityAttributes',
    params: { fields: '*' },
  },
  dataElements: {
    resource: 'dataElements',
    params: { fields: '*' },
  },
  options: {
    resource: 'options',
    params: { fields: '*' },
  },
};

const TroubleshootingEngine = ({ contextPath }) => {
  // State variables to manage the component's state
  const [failedRules, setFailedRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);
  const [validationResults, setValidationResults] = useState({});

  // Use DHIS2 data query hook to fetch data
  const { data, error: queryError, loading: queryLoading } = useDataQuery(query);

  // Effect to handle data fetching results
  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
      setLoading(false);
    } else if (!queryLoading && data) {
      setLoading(false);
      if (data.programRules && data.programRules.programRules) {
        // Sort the rules by creation date in descending order
        const sortedRules = data.programRules.programRules.sort((a, b) => new Date(b.created) - new Date(a.created));
        setFailedRules(sortedRules);
      }
    }
  }, [data, queryError, queryLoading]);

  // Handle click event on a rule to evaluate its conditions and actions
  const handleRuleClick = async (rule) => {
    try {
      const valueMap = await ruleVariableMap(rule.program.id);
      const ruleValidationItem = {
        rule,
        externalLink: ruleExternalLink(rule.id),
      };

      const ruleConditionResult = processRuleCondition(rule.condition, valueMap);

      if (ruleConditionResult) {
        ruleValidationItem.conditionError = ruleConditionResult;
      }
      //checking if the rule has associated actions
      if (!rule.programRuleActions || rule.programRuleActions.length === 0) {
        ruleValidationItem.actionsError = ['This rule has no associated actions. Consider adding actions to make it effective'];
      } else {
        const ruleActionConditions = rule.programRuleActions
          .map((ruleAction) => evaluateAction(ruleAction, valueMap))
          .filter(Boolean);

        if (ruleActionConditions.length > 0) {
          ruleValidationItem.actionsError = ruleActionConditions;
        }
      }
    //checking rule validity
      const isValid = !ruleValidationItem.conditionError && (!ruleValidationItem.actionsError || ruleValidationItem.actionsError.length === 0);
      ruleValidationItem.isValid = isValid;

      setValidationResults((prevState) => ({
        ...prevState,
        [rule.id]: ruleValidationItem,
      }));
    } catch (error) {
      console.error('Error handling rule click:', error);
    }
  };

  // Construct the external link for a rule
  const ruleExternalLink = (uid) => {
    try {
      return `${contextPath}/api/programRules/${uid}?fields=*,programRuleActions[*]`;
    } catch (error) {
      console.error('Error constructing rule external link:', error);
      return '';
    }
  };

  // Map rule variables for a given program UID
  const ruleVariableMap = async (programUid) => {
    if (!programUid || !data) return new Map();

    try {
      const { programRuleVariables, trackedEntityAttributes, dataElements, options } = data;
      return toRuleVariableList(
        programRuleVariables.programRuleVariables,
        trackedEntityAttributes.trackedEntityAttributes,
        dataElements.dataElements,
        options.options
      );
    } catch (error) {
      console.error('Error fetching rule variables:', error);
      return new Map();
    }
  };

  // Create a map of rule variables from various data sources
  const toRuleVariableList = (ruleVariables, trackedEntityAttributes, dataElements, options) => {
    const ruleVariableMap = new Map();

    const trackedEntityAttributeSet = new Set(trackedEntityAttributes.map(attr => attr.id));
    const dataElementSet = new Set(dataElements.map(de => de.id));
    const optionSet = new Set(options.map(option => option.id));

    ruleVariables.forEach((variable) => {
      let valueType;
      let valueKey;

      switch (variable.__typename) {
        case 'RuleVariableCalculatedValue':
          valueType = variable.calculatedValueType;
          valueKey = variable.name;
          break;
        case 'RuleVariableAttribute':
          if (!trackedEntityAttributeSet.has(variable.trackedEntityAttribute)) {
            console.warn(`Invalid trackedEntityAttribute ID: ${variable.trackedEntityAttribute}`);
            return;
          }
          valueType = variable.trackedEntityAttributeType;
          valueKey = variable.trackedEntityAttribute;
          break;
        case 'RuleVariableNewestStageEvent':
        case 'RuleVariableNewestEvent':
        case 'RuleVariableCurrentEvent':
        case 'RuleVariablePreviousEvent':
          if (!dataElementSet.has(variable.dataElement)) {
            console.warn(`Invalid dataElement ID: ${variable.dataElement}`);
            return;
          }
          valueType = variable.dataElementType;
          valueKey = variable.dataElement;
          break;
        default:
          valueType = null;
          valueKey = null;
      }

      if (valueKey) {
        ruleVariableMap.set(variable.name, {
          value: valueKey,
          valueType: valueType,
        });
      }
    });

    // Example of environment variables for the sake of completeness
    const ENV_VARIABLES = {
      ENV_VARIABLE_1: 'NUMERIC',
      ENV_VARIABLE_2: 'TEXT',
      ENV_VARIABLE_3: 'BOOLEAN',
    };

    for (const [envLabelKey, type] of Object.entries(ENV_VARIABLES)) {
      const value = null;
      const ruleValueType = {
        NUMERIC: 'NUMERIC',
        DATE: 'DATE',
        TEXT: 'TEXT',
        BOOLEAN: 'BOOLEAN',
      }[type];
      ruleVariableMap.set(envLabelKey, {
        value: value || ruleValueType.defaultValue,
        valueType: ruleValueType,
      });
    }

    return ruleVariableMap;
  };

  // Process rule conditions and evaluate them using mathjs and custom functions
  const processRuleCondition = (condition, valueMap) => {
    if (!condition) {
      return 'Condition is empty';
    }

    try {
      // Replace variables with their values from the value map
      const replacedCondition = condition.replace(/#\{(\w+)\}/g, (match, name) => {
        if (valueMap.has(name)) {
          const value = valueMap.get(name).value;
          return typeof value === 'string' ? `"${value}"` : value;
        }
        const undefinedVariables = condition.filter(varName => !valueMap.has(varName));

        if (undefinedVariables.length > 0) {
          return `Condition references undefined variables: ${undefinedVariables.join(', ')}`;
        }
        return 'undefined';
      });

      // Define the DHIS2 functions
      const d2HasValue = (value) => value !== null && value !== undefined && value !== '';
      const d2YearsBetween = (startDate, endDate) => {
        if (!startDate || !endDate) return false;
        return differenceInYears(new Date(endDate), new Date(startDate));
      };
      const d2ValidatePattern = (value, pattern) => new RegExp(pattern).test(value);

      // Replace DHIS2 functions in the condition string
      const replacedWithD2Functions = replacedCondition
        .replace(/d2:hasValue\(([^)]+)\)/g, (_, v) => {
          const varName = v.trim().replace(/['"]+/g, '');  // Remove quotes around variable name
          const valueObj = valueMap.get(varName);
          return d2HasValue(valueObj ? valueObj.value : null);
        })
        .replace(/d2:yearsBetween\(([^,]+),\s*([^)]+)\)/g, (_, start, end) => {
          const startVarName = start.trim().replace(/['"]+/g, '');  // Remove quotes around variable name
          const endVarName = end.trim().replace(/['"]+/g, '');      // Remove quotes around variable name
          const startValueObj = valueMap.get(startVarName);
          const endValueObj = valueMap.get(endVarName);
          return d2YearsBetween(
            startValueObj ? startValueObj.value : null,
            endValueObj ? endValueObj.value : null
          );
        })
        .replace(/d2:validatePattern\(([^,]+),\s*'([^']+)'\)/g, (_, value, pattern) => {
          const varName = value.trim().replace(/['"]+/g, '');  // Remove quotes around variable name
          const valueObj = valueMap.get(varName);
          return d2ValidatePattern(valueObj ? valueObj.value : '', pattern);
        });

      // Evaluate the final expression
      console.log('Evaluating condition:', replacedWithD2Functions);  // Debugging line

      // Ensure the replaced condition is correctly formatted for mathjs
      const validExpression = replacedWithD2Functions.replace(/undefined/g, 'null');

      // Evaluate the expression
      const result = evaluate(validExpression);
      return result ? '' : 'Condition evaluated to false';
    } catch (e) {
      console.error(`Error evaluating condition "${condition}":`, e.message);
      return `Condition ${condition} not executed: ${e.message}`;
    }
  };
  // Evaluate actions associated with a rule
  const evaluateAction = (ruleAction, valueMap) => {
    if (ruleAction.needsContent && ruleAction.needsContent()) {
      const actionConditionResult = processRuleCondition(ruleAction.data, valueMap);
      if (actionConditionResult) {
        return actionConditionResult;
      }
    } else {
      return checkActionVariables(ruleAction);
    }
    return null;
  };

  // Check for missing variables in rule actions
  const checkActionVariables = (ruleAction) => {
    if (ruleAction instanceof RuleActionHideField && !ruleAction.field) {
      return 'Missing field';
    }
    if (ruleAction instanceof RuleActionHideOption && (!ruleAction.field || !ruleAction.option)) {
      return 'Missing field or option';
    }
    if (ruleAction instanceof RuleActionHideOptionGroup && (!ruleAction.field || !ruleAction.optionGroup)) {
      return 'Missing field or option group';
    }
    if (ruleAction instanceof RuleActionHideProgramStage && !ruleAction.programStage) {
      return 'Missing program stage';
    }
    if (ruleAction instanceof RuleActionHideSection && !ruleAction.programStageSection) {
      return 'Missing program stage section';
    }
    if (ruleAction instanceof RuleActionSetMandatoryField && !ruleAction.field) {
      return 'Missing field';
    }
    if (ruleAction instanceof RuleActionShowOptionGroup && !ruleAction.optionGroup) {
      return 'Missing option group';
    }
    return null;
  };

  // Toggle the expansion of a rule's details
  const toggleExpandedRule = (index, rule) => {
    setExpandedRule(expandedRule === index ? null : index);
    if (expandedRule !== index) {
      handleRuleClick(rule);
    }
  };

  return (
    <div className="troubleshooting-container">
      <div className="card-bar">
        <div className="validation-bar">
          <BsListCheck className="iconn" />
          <div className="validation-content">
            <h2>Program Rule Validation</h2>
            <p>This action will check all the rules configured and display bad configurations if any</p>
          </div>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && failedRules.length === 0 && <p>No rules found.</p>}
      {!loading && failedRules.length > 0 && failedRules.map((rule, index) => (
        <div key={index} className="card-bar">
          <div className="failed-rules-list">
            <div className="failed-rule">
              <h3 onClick={() => toggleExpandedRule(index, rule)}>{rule.displayName}</h3>
              {expandedRule === index && (
                <div className="rule-details">
                  <ul>
                    {Array.isArray(rule.condition) ? (
                      rule.condition.map((condition, idx) => (
                        <li key={idx}>{condition}</li>
                      ))
                    ) : (
                      <li>{rule.condition}</li>
                    )}
                  </ul>
                  <h4>Validation Results:</h4>
                  {validationResults[rule.id] && validationResults[rule.id].isValid === false ? (
                    <div className="validation-error">
                      <p>{validationResults[rule.id].conditionError}</p>
                      {validationResults[rule.id].actionsError && validationResults[rule.id].actionsError.map((error, idx) => (
                        <p key={idx}>{error}</p>
                      ))}
                    </div>
                  ) : (
                    <p>{validationResults[rule.id]?.isValid ? 'Rule is valid.' : 'No validation errors found.'}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <button className="buttonn"><Link to="/" style={{ textDecoration: 'none' }}>HOME</Link></button>
    </div>
  );
};

export default TroubleshootingEngine;
