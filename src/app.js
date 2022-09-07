import { ApplicationService } from './service/application_service.js';

class ProgramFlow {
    info = {
        application: null,
        scope: [],
        function: [],
        variable: [],
        statement: [],
        path: []
    };
    
    constructor() {
        const service = new ApplicationService();
        
        const defaultApp = service.createApplication(
            "DefaultApplication",
            "MainFunction"
        );
        this.info.application = defaultApp.application;
        this.info.scope.push(defaultApp.appScope);
        this.info.scope.push(defaultApp.funcScope);
        this.info.function.push(defaultApp.mainFunc);
        this.info.statement.push(defaultApp.startStmt);
        this.info.statement.push(defaultApp.returnStmt);
        this.info.path.push(defaultApp.path);
        
        const declaration = service.createDeclarationStatement(
            this.info.path.at(0),
            this.info.scope.at(1),
            {name: "firstName", category: "Primitive", type1: "String"},
            "Sashir"
        );
        this.info.statement.push(declaration.declarationStmt);
        this.info.variable.push(declaration.variable);
        this.info.path[0] = declaration.path;
        this.info.path.push(declaration.newPath);
    }
}

export { ProgramFlow };