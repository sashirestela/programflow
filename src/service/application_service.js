import * as symb from './../model/symbols.js';
import * as stmt from './../model/statements.js';
import { Application } from './../model/application.js';

class ApplicationService {
    constructor() {}

    createDefaultApplication() {
        const appScope = new symb.Scope({
            scopeType: symb.ScopeType.Application
        });
        const funcScope = new symb.Scope({
            scopeType: symb.ScopeType.Function,
            parentScopeId: appScope.id
        })
        const returnStmt = new stmt.Return({
            surroundScopeId: funcScope.id
        });
        const startReturnPath = new stmt.Path({
            prevStatementId: returnStmt.id,
            nextStatementId: returnStmt.id
        });
        const startStmt = new stmt.Start({
            surroundScopeId: funcScope.id,
            pathIdList: [startReturnPath.id]
        });
        startReturnPath.prevStatementId = startStmt.id;
        const mainFunc = new symb.Function({
            name: "Main Function",
            startStatementId: startStmt.id,
            scopeId: funcScope.id,
            isMain: symb.Function.MAIN
        });
        const defaultApp = new Application({
            name: "Default Application",
            scopeId: appScope.id,
            functionIdList: [mainFunc.id]
        });
        return {
            app: defaultApp,
            appScope: appScope,
            funcScope: funcScope,
            mainFunc: mainFunc,
            startStmt: startStmt,
            path: startReturnPath,
            returnStmt: returnStmt
        }
    }
}

export {
    ApplicationService
}