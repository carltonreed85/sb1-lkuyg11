import net from 'net';
import { logger } from '../../utils/logger';

export class HL7Client {
  private host: string;
  private port: number;
  private facilityId: string;

  constructor(config: { host: string; port: number; facilityId: string }) {
    this.host = config.host;
    this.port = config.port;
    this.facilityId = config.facilityId;
  }

  private createHL7Message(messageType: string, data: any): string {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '');
    
    // Basic HL7 message structure
    return [
      'MSH|^~\\&|RMD|' + this.facilityId + '|EHR|FACILITY|' + timestamp + '||' + messageType + '|MSG001|P|2.5.1',
      'PID|||' + data.patientId + '||' + data.patientName + '|||||',
      'PV1||O|||||' + data.referringProvider + '|' + data.receivingProvider + '|||||||||||',
      'OBR|1|||' + data.specialty + '|||' + timestamp + '||||' + data.priority + '||||' + data.reason
    ].join('\r');
  }

  private async sendMessage(message: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const client = new net.Socket();
      let response = '';

      client.connect(this.port, this.host, () => {
        client.write(message);
      });

      client.on('data', (data) => {
        response += data.toString();
      });

      client.on('end', () => {
        resolve(response);
      });

      client.on('error', (error) => {
        logger.error('HL7 connection error', error);
        reject(error);
      });
    });
  }

  async getPatient(patientId: string) {
    const qryMessage = this.createHL7Message('QRY', {
      patientId,
      messageType: 'QRY^A19'
    });
    
    const response = await this.sendMessage(qryMessage);
    return this.parseHL7Response(response);
  }

  async sendReferral(data: any) {
    const refMessage = this.createHL7Message('REF', data);
    return this.sendMessage(refMessage);
  }

  private parseHL7Response(response: string) {
    // Parse HL7 response into structured data
    const segments = response.split('\r').reduce((acc, segment) => {
      const [type, ...fields] = segment.split('|');
      acc[type] = fields;
      return acc;
    }, {} as Record<string, string[]>);

    return segments;
  }
}