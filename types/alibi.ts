export type ScreenState = 
|"landing" //layar auth
|"setup" //konfigurasi dashboard
| "ringing" //panggilan masuk
|"in call" //telpon aktif
|"pricing" //layar langganan

export type TriggerMode = "timer" | "shake";

export interface PresetContact {
    id: "mama" | "kantor" | "kurir" | "klinik"
    label: string;
    callerName: string;
    callerNumber: string;
    defaultScript: string;
    audioPath: string;
    themeColor: string;
}


export interface ActiveScenario {
    callerName: string;
    callerNumber: string;
    script: string;
    audioUrl?: string;
    voiceGender?: "female" | "male";
    triggerMode: TriggerMode;
    timeDuration: number;
}