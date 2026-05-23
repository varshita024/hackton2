"use client";

export interface SMSMessage {
  to: string;
  message: string;
  timestamp: Date;
}

class MockSMSProvider {
  private messageLog: SMSMessage[] = [];

  async sendSMS(to: string, message: string): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const smsMessage: SMSMessage = {
      to,
      message,
      timestamp: new Date(),
    };

    this.messageLog.push(smsMessage);

    // Log to console for demo purposes
    console.log(`[SMS Mock] To: ${to}`);
    console.log(`[SMS Mock] Message: ${message}`);
    console.log(`[SMS Mock] Time: ${smsMessage.timestamp.toLocaleTimeString()}`);

    return true;
  }

  getMessageLog(): SMSMessage[] {
    return this.messageLog;
  }

  clearLog(): void {
    this.messageLog = [];
  }
}

// Singleton instance
export const mockSMSProvider = new MockSMSProvider();
