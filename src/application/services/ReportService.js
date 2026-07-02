export class ReportService {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  summary(startDate, endDate) {
    const today = new Date().toISOString().slice(0, 10);
    return this.transactionRepository.summary(startDate || today, endDate || today);
  }
}
