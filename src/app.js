import { ApplicationService } from './service/application_service.js';

class ProgramFlow {
    constructor() {
        const service = new ApplicationService();
        this.app = service.createDefaultApplication();
    }
}

export { ProgramFlow };