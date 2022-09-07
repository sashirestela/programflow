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
            prevStatementId: "temp",
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
            returnStmt: returnStmt,
            path: path
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
            prevStatementId: "temp",
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
        scope.symbolMap[variable.name] = variable;
        return {
            variable: variable,
            declarationStmt: declarationStmt,
            newPath: newPath,
            path: path
        }
    }

    createIfElseStatement(path, scope, expr) {
        const ifElseScope = new symb.Scope({
            scopeType: symb.ScopeType.CompoundFork,
            parentScopeId: scope.id
        })
        const expression = expr !== undefined
            ? new stmt.Expression(expr)
            : null;
        const truePath = new stmt.Path({
            case: new stmt.Expression("true"),
            prevStatementId: "temp",
            nextStatementId: "temp"
        });
        const falsePath = new stmt.Path({
            case: new stmt.Expression("false"),
            prevStatementId: "temp",
            nextStatementId: "temp"
        });
        const auxPath = new stmt.Path({
            prevStatementId: "temp",
            nextStatementId: path.nextStatementId
        });
        const ifElseStmt = new stmt.IfElse({
            surroundScopeId: ifElseScope.id,
            pathIdList: [truePath.id, falsePath.id],
            testExpression: expression,
            relatedId: "temp",
            scopeId: ifElseScope.id
        });
        const auxStmt = new stmt.Boundary({
            surroundScopeId: scope.id,
            pathIdList: [auxPath.id],
            relatedId: ifElseStmt.id
        });
        ifElseStmt.relatedId = auxStmt.id;
        auxPath.prevStatementId = auxStmt.id;
        truePath.prevStatementId = ifElseStmt.id;
        truePath.nextStatementId = auxStmt.id;
        falsePath.prevStatementId = ifElseStmt.id;
        falsePath.nextStatementId = auxStmt.id;
        path.nextStatementId = ifElseStmt.id;
        return {
            ifElseScope: ifElseScope,
            ifElseStmt: ifElseStmt,
            auxStmt: auxStmt,
            truePath: truePath,
            falsePath: falsePath,
            auxPath: auxPath,
            path: path
        }
    }
}

export {
    ApplicationService
}