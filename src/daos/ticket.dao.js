import ticketModel from "../models/ticket.model.js";

export default class TicketDAO {
    async createTicket(ticketData) {
        const ticket = new ticketModel(ticketData);
        await ticket.save();
        return ticket;
    }
}