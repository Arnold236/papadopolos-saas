import DailyIframe from "@daily-co/daily-js";

export interface TelehealthConfig {
  apiKey: string;
  baseUrl: string;
  domain: string;
}

export class TelehealthService {
  private config: TelehealthConfig;

  constructor(config: TelehealthConfig) {
    this.config = config;
  }

  async createMeeting(options: {
    roomName: string;
    properties?: {
      enable_chat?: boolean;
      enable_prejoin_ui?: boolean;
      enable_knocking?: boolean;
      enable_screenshare?: boolean;
      enable_recording?: boolean;
      lang?: string;
    };
  }) {
    try {
      const response = await fetch(`${this.config.baseUrl}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          name: options.roomName,
          properties: {
            enable_chat: true,
            enable_prejoin_ui: true,
            enable_knocking: true,
            enable_screenshare: true,
            enable_recording: "cloud",
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
            ...options.properties,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create meeting room");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating meeting:", error);
      throw error;
    }
  }

  async generateMeetingToken(roomName: string, userId: string, userName: string, isOwner: boolean = false) {
    try {
      const response = await fetch(`${this.config.baseUrl}/meeting-tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          properties: {
            room_name: roomName,
            user_id: userId,
            user_name: userName,
            is_owner: isOwner,
            enable_recording: isOwner ? "cloud" : "none",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate meeting token");
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Error generating meeting token:", error);
      throw error;
    }
  }

  async getRoomParticipants(roomName: string) {
    try {
      const response = await fetch(`${this.config.baseUrl}/rooms/${roomName}/participants`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch participants");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching participants:", error);
      throw error;
    }
  }

  async endMeeting(roomName: string) {
    try {
      const response = await fetch(`${this.config.baseUrl}/rooms/${roomName}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to end meeting");
      }

      return true;
    } catch (error) {
      console.error("Error ending meeting:", error);
      throw error;
    }
  }

  async getRecordings(roomName: string) {
    try {
      const response = await fetch(`${this.config.baseUrl}/recordings?room=${roomName}`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recordings");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching recordings:", error);
      throw error;
    }
  }
}

export function generateMeetingId(): string {
  return `meet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateTelehealthRequirements(): {
  camera: boolean;
  microphone: boolean;
  internet: boolean;
  browser: boolean;
} {
  const isSecure = window.location.protocol === "https:";
  const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const isModernBrowser = "RTCPeerConnection" in window;

  return {
    camera: hasGetUserMedia,
    microphone: hasGetUserMedia,
    internet: navigator.onLine,
    browser: isSecure && isModernBrowser,
  };
}

export function calculateBandwidthRequirements(type: "video" | "audio" | "chat"): {
  upload: number;
  download: number;
} {
  const requirements = {
    video: { upload: 1000, download: 1000 }, // kbps
    audio: { upload: 100, download: 100 }, // kbps
    chat: { upload: 10, download: 10 }, // kbps
  };

  return requirements[type] || requirements.video;
}

export function formatConsultationDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
}

export function getConsultationTypeIcon(type: string): string {
  switch (type) {
    case "VIDEO":
      return "🎥";
    case "AUDIO":
      return "🎤";
    case "CHAT":
      return "💬";
    default:
      return "🩺";
  }
}

// Daily.co integration helper
export function initializeDailyCallFrame(container: HTMLElement, options: any) {
  const callFrame = DailyIframe.createFrame(container, options);
  
  // Set up event listeners
  callFrame.on("joined-meeting", (event) => {
    console.log("Joined meeting:", event);
  });
  
  callFrame.on("left-meeting", (event) => {
    console.log("Left meeting:", event);
  });
  
  callFrame.on("participant-joined", (event) => {
    console.log("Participant joined:", event);
  });
  
  callFrame.on("participant-left", (event) => {
    console.log("Participant left:", event);
  });
  
  callFrame.on("recording-started", (event) => {
    console.log("Recording started:", event);
  });
  
  callFrame.on("recording-stopped", (event) => {
    console.log("Recording stopped:", event);
  });
  
  return callFrame;
}