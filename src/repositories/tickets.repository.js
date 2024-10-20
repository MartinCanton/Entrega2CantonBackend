import TicketDAO from "../daos/ticket.dao.js";

export default class TicketsRepository {
    constructor() {
        this.ticketDAO = new TicketDAO();
    }

    async createTicket(ticketData) {
        return await this.ticketDAO.createTicket(ticketData);
    }
}