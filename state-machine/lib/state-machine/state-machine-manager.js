const _ = require('lodash');
const StateMachineFactory = require('./state-machine-factory');
const StateMachineDBAccessor = require('../db/state-machine-db-accesor');
const PGAccessBase = require('../base/pg-access-base');

class StateMachineManager extends PGAccessBase{
    constructor(requestContext, dependencies, config) {
        super(requestContext, dependencies);
        this.stateMachineConfigCache = {};
        this.postTxnFns = [];
        this.stateMachineFactory = new StateMachineFactory(requestContext, dependencies, config);
        this.stateMachineDBAccessor = new StateMachineDBAccessor(requestContext, dependencies);
    }
    async initiateByEvent(stateMachineId, eventName, args) {
        //get actions for event
        let actions = await this._getEventActionsByEventName(stateMachineId, eventName);
        if(!_.isEmpty(actions)) {
            //trigger actions
            await this.transaction(async (t) => {
                args.t = t;
                await this._triggerActions(stateMachineId, actions, args);
            })
            
        }
        //return result;
        return args.result
    }

    async intiateByAction(stateMachineId, actionName, args) {

    }

    async _getEventActionsByEventName(stateMachineId, eventName) {
        let stateMachineConfig = await this.getStateMachineConfigById(stateMachineId);
        if(stateMachineConfig) {
            let event =  _.find(stateMachineConfig.events, (e) => {
                if(_.isArray(e.name)) {
                    return _.includes(e.name, eventName);
                } else {
                    return e.name == eventName;
                }
            });

            if(!_.isEmpty(event)) {
                return event.actions;
            }
        }
        return [];
    }

    async _trigger(stateMachineId, actionName, args, exceptionEvent) {
        try {
            let action = this.stateMachineFactory.getAction(actionName);
            if(_.isEmpty(action)) {
                console.log('No action found in statemachine for action name: ', actionName);
                return;
            }
            let event = await action.doAction(args);
            if(event) {
                let actions = await this._getEventActionsByEventName(stateMachineId, event);
                if(!_.isEmpty(actions)) {
                    await this._triggerActions(stateMachineId, actions, args);
                }
            }
        } catch(err) {
            await this._triggerExceptionHandler(stateMachineId, exceptionEvent, args);
            console.log(err);
        }
      
    }

    async _triggerExceptionHandler(stateMachineId, exceptionEvent, args) {
        if(exceptionEvent) {
            let actions = this._getEventActionsByEventName(stateMachineId, exceptionEvent);
            if(!_.isEmpty(actions)) {
                await this._triggerActions(stateMachineId, actions, args);
            }
        }
    }

    async _triggerActions(stateMachineId, actions, args) {
        for(let _action of actions) {
            let nextStateMachineId = _action.state_machine_id || stateMachineId;
            if(_action.async && _action.exchange) {
                //handle queuing operations
            } else {
                await this._trigger(nextStateMachineId, _action.name, args, _action.exception);
            }
        }
    }

    async getStateMachineConfigById(stateMachineId) {
            let result = await this.stateMachineDBAccessor.getByName(stateMachineId);
            return result.data;
    }
} 

module.exports = StateMachineManager;