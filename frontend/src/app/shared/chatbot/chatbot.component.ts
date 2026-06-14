import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

interface Message { text: string; from: 'bot' | 'user'; }

const BOT_RESPONSES = [
  { k: ['hello','hi','hey'], r: "Hello! Welcome to NexCare Support. How can I assist you today?" },
  { k: ['internet','wifi','connection','network','broadband'], r: "For internet issues: 1) Restart your router (unplug 30 sec). 2) Check all cables. 3) Try Ethernet. Still having trouble? Raise a support ticket!" },
  { k: ['slow','speed','lag'], r: "Slow speeds can be due to congestion. Try fast.com for a speed test. If below your plan speed, raise a ticket and our team will investigate." },
  { k: ['tv','channel','cable','signal'], r: "For TV issues: 1) Check HDMI/coaxial connections. 2) Restart your set-top box. 3) Re-scan channels in Settings. Still missing channels? We'll send a technician." },
  { k: ['billing','payment','invoice','charge'], r: "For billing queries, view invoices in your account. Incorrect charge? Raise a ticket under 'Billing' and we'll review within 24 hours." },
  { k: ['plan','upgrade','subscription','package'], r: "Plans: Basic (₹499/mo - 25Mbps), Standard (₹799/mo - 100Mbps + TV), Premium (₹1199/mo - 300Mbps + Full Bundle). Contact us to upgrade!" },
  { k: ['mobile','4g','lte','sim','data'], r: "Mobile data issues: 1) Toggle airplane mode. 2) Check APN settings. 3) Reinsert SIM. Still issues? Raise a ticket under 'Mobile Data'." },
  { k: ['phone','call','landline','voice'], r: "For voice issues: 1) Check handset connection. 2) Listen for dial tone. 3) Try a different phone. Calls dropping? Raise a support ticket." },
  { k: ['outage','down','offline'], r: "There may be an outage in your area. Check the outage map on your dashboard. Our team is working to restore services ASAP." },
  { k: ['password','login','account','forgot'], r: "For login issues, use 'Forgot Password' on the login page. For account queries, go to Profile Settings." },
  { k: ['ticket','complaint','issue','problem','help'], r: "I can help you raise a ticket! Go to 'My Tickets' → 'Raise New Ticket', select your domain, and describe the issue. We respond within 2 hours." },
  { k: ['thank','thanks','bye','goodbye'], r: "You're welcome! Is there anything else I can help you with? Our support team is available 24/7." },
];

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const entry of BOT_RESPONSES) {
    if (entry.k.some(k => lower.includes(k))) return entry.r;
  }
  return `I understand you need help with: "${input}". Please raise a ticket from 'My Tickets' and a representative will contact you shortly.`;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent implements OnInit {
  @ViewChild('msgContainer') msgContainer!: ElementRef;

  isOpen = false;
  messages: Message[] = [];
  inputText = '';

  constructor(private chat: ChatService) {}

  ngOnInit() {
    this.chat.open$.subscribe(() => {
      if (!this.isOpen) this.toggle();
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.addBot("Hi! I'm NexCare Virtual Assistant 🤖 How can I help? Ask about internet, billing, plans, or any service issue!");
    }
  }

  send() {
    const text = this.inputText.trim();
    if (!text) return;
    this.inputText = '';
    this.messages.push({ text, from: 'user' });
    this.scrollBottom();
    setTimeout(() => {
      this.addBot(getBotResponse(text));
    }, 600);
  }

  private addBot(text: string) {
    this.messages.push({ text, from: 'bot' });
    this.scrollBottom();
  }

  private scrollBottom() {
    setTimeout(() => {
      if (this.msgContainer?.nativeElement) {
        this.msgContainer.nativeElement.scrollTop = this.msgContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }
}
