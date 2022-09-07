import * as symb from './../model/symbols.js';
import * as stmt from './../model/statements.js';
import * as dt from './../model/datatypes.js';
import { Application } from './../model/application.js';

class ApplicationService {
    constructor() {}

    createApplication(nameApp, nameFunc) {
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
        const path = new stmt.Path({
            prevStatementId: returnStmt.id,
            nextStatementId: returnStmt.id
        });
        const startStmt = new stmt.Start({
            surroundScopeId: funcScope.id,
            pathIdList: [path.id]
        });
        path.prevStatementId = startStmt.id;
        const mainFunc = new symb.Function({
            name: nameFunc,
            startStatementId: startStmt.id,
            scopeId: funcScope.id,
            isMain: symb.Function.MAIN
        });
        const application = new Application({
            name: nameApp,
            scopeId: appScope.id,
            functionIdList: [mainFunc.id]
        });
        return {
            application: application,
            appScope: appScope,
            funcScope: funcScope,
            mainFunc: mainFunc,
            startStmt: startStmt,
            path: path,
            returnStmt: returnStmt
        }
    }

    createDeclarationStatement(path, scope, varInfo, expr) {
        const dataType = dt.DataType.create(
            varInfo.category,
            varInfo.type1, 
            varInfo.type2
        );
        const variable = new symb.Variable({
            name: varInfo.name,
            dataType: dataType
        })
        const expression = expr !== undefined
            ? new stmt.Expression(expr)
            : null;
        const newPath = new stmt.Path({
            prevStatementId: path.nextStatementId,
            nextStatementId: path.nextStatementId
        });
        const declarationStmt = new stmt.Declaration({
            surroundScopeId: scope.id,
            pathIdList: [newPath.id],
            variableIdList: [variable.id],
            expressionList: [expression]
        });
        newPath.prevStatementId = declarationStmt.id;
        path.nextStatementId = declarationStmt.id;
        return {
            variable: variable,
            declarationStmt: declarationStmt,
            newPath: newPath,
            path: path
        }
    }
}

export {
    ApplicationService
}