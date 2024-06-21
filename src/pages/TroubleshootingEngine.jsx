import React, { useState, useEffect } from 'react';
import { BsListCheck } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import { evaluate } from 'mathjs';
import { differenceInYears } from 'date-fns';
import './TroubleshootingEngine.css';


/**
 * this class defines the programRule action fields
 * @class RuleActionHideField
 * @typedef {RuleActionHideField}
 */
class RuleActionHideField {
  constructor(field) {
    this.field = field;
  }
  needsContent() {
    return !!this.field;
  }
}


/**
 *this class defines the programRule action fields
 * @class RuleActionHideOption
 * @typedef {RuleActionHideOption}
 */
class RuleActionHideOption {
  constructor(field, option) {
    this.field = field;
    this.option = option;
  }
  needsContent() {
    return !!this.field && !!this.option;
  }
}

/**
 * this class defines the programRule action fields
 * @class RuleActionHideOptionGroup
 * @typedef {RuleActionHideOptionGroup}
 */
class RuleActionHideOptionGroup {
  constructor(field, optionGroup) {
    this.field = field;
    this.optionGroup = optionGroup;
  }
  needsContent() {
    return !!this.field && !!this.optionGroup;
  }
}

/**
 * this class defines the programRule action fields
 * @class RuleActionHideProgramStage
 * @typedef {RuleActionHideProgramStage}
 */
class RuleActionHideProgramStage {
  constructor(programStage) {
    this.programStage = programStage;
  }
  needsContent() {
    return !!this.programStage;
  }
}

/**
 * this class defines the programRule action fields
 * @class RuleActionHideSection
 * @typedef {RuleActionHideSection}
 */
class RuleActionHideSection {
  constructor(programStageSection) {
    this.programStageSection = programStageSection;
  }
  needsContent() {
    return !!this.programStageSection;
  }
}


/**
 * this class defines the programRule action fields
 * @class RuleActionSetMandatoryField
 * @typedef {RuleActionSetMandatoryField}
 */
class RuleActionSetMandatoryField {
  constructor(field) {
    this.field = field;
  }
  needsContent() {
    return !!this.field;
  }
}

/**
 * this class defines the programRule action fields
 * @class RuleActionShowOptionGroup
 * @typedef {RuleActionShowOptionGroup}
 */
class RuleActionShowOptionGroup {
  constructor(optionGroup) {
    this.optionGroup = optionGroup;
  }
  needsContent() {
    return !!this.optionGroup;
  }
}


/**
 * this is a dhis2 instance query request which return the following resources in the 
 * @type {{ programRules: { resource: string; params: { fields: string; }; }; programRuleVariables: { resource: string; params: { fields: string; }; }; trackedEntityAttributes: { resource: string; params: { fields: string; }; }; dataElements: { ...; }; options: { ...; }; }}
 */
const query = {
  programRules: {
    resource: 'programRules',
    params: { fields: '*,created' },
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

/**
 * this the whole programRule engine component with its associated function implementation
 * @param {{ contextPath: any; }} param0
 * @param {*} param0.contextPath
 * @returns {*}
 */
const TroubleshootingEngine = ({ contextPath }) => {
  const [failedRules, setFailedRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);
  const [validationResults, setValidationResults] = useState({});
  const [previousData, setPreviousData] = useState(null);

  const { data, error: queryError, loading: queryLoading, refetch } = useDataQuery(query);
/**
 * this the function fetch and load program rules from dhis2 instance using the use data query
 * @param {{ contextPath: any; }} param0
 * @param {*} param0.contextPath
 * @returns {*}
 */
  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
      setLoading(false);
    } else if (!queryLoading && data) {
      setLoading(false);
      if (data.programRules && data.programRules.programRules) {
        const sortedRules = data.programRules.programRules.sort((a, b) => new Date(b.created) - new Date(a.created));
        setFailedRules(sortedRules);
        setPreviousData(data);
      }
    }
  }, [data, queryError, queryLoading]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const newData = await refetch();
        if (JSON.stringify(newData) !== JSON.stringify(previousData)) {
          // If data has changed, reload the page
          window.location.reload();
        }
      } catch (error) {
        console.error('Error fetching new data:', error);
      }
    }, 60000); // Check for updates every 60 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [previousData, refetch]);

  /**

   * this function map the clicked rule into the validation logic to be processed
   * @async
   * @param {*} rule
   * @returns {*}
   */
  const handleRuleClick = async (rule) => {
    try {
      const valueMap = await ruleVariableMap(rule.program.id);
      const ruleValidationItem = {
        rule,
        externalLink: ruleExternalLink(rule.id),
      };
     
      /**
    
       * this function handles the calling of and mapping of the rule to so that the validation logic can begin taking effect
       * @type {string}
       */
      const ruleConditionResult = processRuleCondition(rule.condition, valueMap);
       
      if (ruleConditionResult) {
        ruleValidationItem.conditionError = ruleConditionResult;
      }
       /**
    
       * this the first validation step, the logic checks the existence of rule action in the system and flagged an error if the rule is created without associated action
       * @returns {*}
       */
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
      
      
      /**
    
       * this second validation test, the function takes the rule which has passed the first validation for further check
       * it updates the state
       * @type {boolean}
       */
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
  
  /**

   * this makes api calls to return the function with associated programruleaction and everything in that rule action
   * @param {*} uid
   * @returns {string}
   */
  const ruleExternalLink = (uid) => {
    try {
      return `${contextPath}/api/programRules/${uid}?fields=*,programRuleActions[*]`;
    } catch (error) {
      console.error('Error constructing rule external link:', error);
      return '';
    }
  };
 
  /**

   * this the third validation logic on the rule, the function maps the rule which passed the first two tests
   * this validation logic evaluates the program rule action further now to  check if the actions has the defined data elements, trackedEntity attributes, variables and options for the rule to take effect
   * @async
   * @param {*} programUid
   * @returns {unknown}
   */
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

   /**

   * this validation logic  is the extension from the third validation logic, it evaluates the program rule action further now to  check if the actions has the defined data elements, trackedEntity attributes, variables and options for the rule to take effect
   * @async
   * @param {*} programUid
   * @returns {unknown}
   */
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



  /**
   * this is the fourth validation logic down the line, which evalautes the rule after it has passed the third logical test
   * this validation checks the condition expression 
   * @param {*} condition
   * @param {*} valueMap
   * @returns {string}
   */
  const processRuleCondition = (condition, valueMap) => {
    if (!condition) {
      return 'Condition is empty';
    }

    try {
      // List to track undefined variables
      const undefinedVariables = [];

      // Replace variables with their values from the valueMap
      const replacedCondition = condition.replace(/#\{(\w+)\}/g, (match, name) => {
        if (valueMap.has(name)) {
          const value = valueMap.get(name).value;
          return typeof value === 'string' ? `"${value}"` : value;
        } else {
          undefinedVariables.push(name);
          return 'undefined';
        }
      });

      // Check for numeric-only conditions
      const numericOnlyConditionRegex = /^[\d\s=<>!&|]+$/;
      if (numericOnlyConditionRegex.test(replacedCondition)) {
        return 'Condition is invalid: numeric-only comparisons are not allowed';
      }
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
          const varName = v.trim().replace(/['"]+/g, ''); // Remove quotes around variable name
          const valueObj = valueMap.get(varName);
          return d2HasValue(valueObj ? valueObj.value : null);
        })
        .replace(/d2:yearsBetween\(([^,]+),\s*([^)]+)\)/g, (_, start, end) => {
          const startVarName = start.trim().replace(/['"]+/g, ''); // Remove quotes around variable name
          const endVarName = end.trim().replace(/['"]+/g, ''); // Remove quotes around variable name
          const startValueObj = valueMap.get(startVarName);
          const endValueObj = valueMap.get(endVarName);
          return d2YearsBetween(
            startValueObj ? startValueObj.value : null,
            endValueObj ? endValueObj.value : null
          );
        })
        .replace(/d2:validatePattern\(([^,]+),\s*'([^']+)'\)/g, (_, value, pattern) => {
          const varName = value.trim().replace(/['"]+/g, ''); // Remove quotes around variable name
          const valueObj = valueMap.get(varName);
          return d2ValidatePattern(valueObj ? valueObj.value : '', pattern);
        });

      // Ensure the replaced condition is correctly formatted for mathjs
      const validExpression = replacedWithD2Functions.replace(/undefined/g, 'null');

      // Evaluate the final expression
      console.log('Evaluating condition:', validExpression); // Debugging line

      const result = evaluate(validExpression);
      return result ? '' : 'Condition evaluated to false: this might be due to lack of mapped value or variable';
    } catch (e) {
      console.error(`Error evaluating condition "${condition}":`, e.message);
      return `Condition ${condition} not executed: ${e.message}`;
    }
  };
 
  
  /**
   * this is the extesnion of fourth validation logic
   * this validation checks the condition expression, it evaluates the expression if it needs some content or not
   * it also call the last varidation for actionvariables
   * @param {*} ruleAction
   * @param {*} valueMap
   * @returns {string}
   */
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

  /**

   * this function uses the classes which are defined on the top of the component 
   * it checks the rule action variables if it has the returns
   * @param {*} ruleAction
   * @returns {("Missing field" | "Missing field or option" | "Missing field or option group" | "Missing program stage" | "Missing program stage section" | "Missing option group")}
   */
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

  /**

   * this function is responsible for handling the rule clicks to roggle and display the varidation rules
   * @param {*} index
   * @param {*} rule
   */
  const toggleExpandedRule = (index, rule) => {
    setExpandedRule(expandedRule === index ? null : index);
    if (expandedRule !== index) {
      handleRuleClick(rule);
    }
  };
   /**
   * Rendering the component
   *
   */
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
                    <p>{validationResults[rule.id]?.isValid ? 'Rule will trigger the action.' : 'No validation errors found.'}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <button className="buttonn"><Link to="/" style={{ textDecoration: 'none', color:'white', }}>BACK</Link></button>
    </div>
  );
};

export default TroubleshootingEngine;