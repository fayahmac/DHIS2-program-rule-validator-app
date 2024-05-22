import React, { useState, useEffect } from 'react';
import { BsListCheck } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import './TroubleshootingEngine.css'; // Import CSS file for styling

class RuleActionHideField {}
class RuleActionHideOption {}
class RuleActionHideOptionGroup {}
class RuleActionHideProgramStage {}
class RuleActionHideSection {}
class RuleActionSetMandatoryField {}
class RuleActionShowOptionGroup {}

const query = {
  programRules: {
    resource: 'programRules',
    params: { fields: '*' },
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

const TroubleshootingEngine = () => {
  const [failedRules, setFailedRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);
  const [validationResults, setValidationResults] = useState({});

  const { data, error: queryError, loading: queryLoading } = useDataQuery(query);

  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
      setLoading(false);
    } else if (!queryLoading && data) {
      setLoading(false);
      console.log('Fetched data:', data); // Debug: Log fetched data
      // Process data if necessary
      if (data.programRules && data.programRules.programRules) {
        setFailedRules(data.programRules.programRules);
      }
    }
  }, [data, queryError, queryLoading]);

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

      const ruleActionConditions = rule.programRuleActions
        .map((ruleAction) => evaluateAction(ruleAction, valueMap))
        .filter(Boolean);

      if (ruleActionConditions.length > 0) {
        ruleValidationItem.actionsError = ruleActionConditions;
      }

      const isValid = !ruleValidationItem.conditionError && ruleActionConditions.length === 0;
      ruleValidationItem.isValid = isValid;

      setValidationResults((prevState) => ({
        ...prevState,
        [rule.id]: ruleValidationItem,
      }));
    } catch (error) {
      console.error('Error handling rule click:', error);
    }
  };

  const ruleExternalLink = (uid) => {
    try {
      const contextPath = d2.system.systemInfo.contextPath;
      return `${contextPath}/api/programRules/${uid}?fields=*,programRuleActions[*]`;
    } catch (error) {
      console.error('Error constructing rule external link:', error);
      return '';
    }
  };

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

  const toRuleVariableList = (ruleVariables, trackedEntityAttributes, dataElements, options) => {
    const ruleVariableMap = new Map();

    ruleVariables.forEach((variable) => {
      let valueType;
      let valueKey;

      switch (variable.__typename) {
        case 'RuleVariableCalculatedValue':
          valueType = variable.calculatedValueType;
          valueKey = variable.name;
          break;
        case 'RuleVariableAttribute':
          valueType = variable.trackedEntityAttributeType;
          valueKey = variable.trackedEntityAttribute;
          break;
        case 'RuleVariableNewestStageEvent':
        case 'RuleVariableNewestEvent':
        case 'RuleVariableCurrentEvent':
        case 'RuleVariablePreviousEvent':
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
      const value = null; // Replace with actual environment variable value if available
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

  const processRuleCondition = (condition, valueMap) => {
    if (!condition) {
      return 'Condition is empty';
    }

    // try {
    //   const expression = new Expression(condition, 'RULE_ENGINE_CONDITION');
    //   const expressionData = {
    //     supplementaryValues: {},
    //     programRuleVariableValues: valueMap,
    //   };
    //   expression.evaluate((name) => {
    //     throw new Error(name);
    //   }, expressionData);

    //   return '';
    // } catch (e) {
    //   console.error(`Error evaluating condition "${condition}":`, e.message);
    //   return `Condition ${condition} not executed: ${e.message}`;
    // }
  };

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

  const toggleExpandedRule = (index, rule) => {
    setExpandedRule(expandedRule === index ? null : index);
    if (expandedRule !== index) {
      handleRuleClick(rule);
    }
  };

  return (
    <div className="troubleshooting-container">
      <h1 className="troubleshooting-heading">Configuration and Troubleshooting Engine</h1>
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
