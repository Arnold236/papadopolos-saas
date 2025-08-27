'use client'

import { cn, configureAssistant, getSubjectColor } from '@/lib/utils'
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import soundwaves from "../constants/soundwaves.json"
import { addToSessionHistory } from '@/lib/actions/companion.actions';

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}
const CompanionComponent = ({companionId, subject, topic, name, userName, userImage, style, voice}: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false)
    const [Messages, setMessages] = useState<SavedMessage[]>([])

    const lottieRef = useRef<LottieRefCurrentProps>(null);
    useEffect(() => {
        if (lottieRef) {
            if (isSpeaking) lottieRef.current?.play()
            else lottieRef.current?.stop()
        }
    },[isSpeaking, lottieRef])

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.INACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
        //  Add to Session History
        addToSessionHistory(companionId);
        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = {role: message, content: message.transcript}
                 setMessages((prev) => [newMessage, ...prev])
            }
           
        };
        const onError = (error: Error) => console.log(error);

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
    
        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
        vapi.off('call-start', onCallStart);
        vapi.off('call-end', onCallEnd);
        vapi.off('message', onMessage);
        vapi.off('error', onError);
        vapi.off('speech-start', onSpeechStart);
        vapi.off('speech-end', onSpeechEnd);
        }
    }, []);

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted);
    }
    const handleDiconnect = async () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    }
    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        const assistantOvverides = {
            variableValues: {
                subject, topic, style
            },
            clientMessage: ['transcript'],
            serverMessage: []
        }

        vapi.start(configureAssistant(voice, style), assistantOvverides)
    }
    
  return (
    <section className='flex flex-col h-[70vh]'>
        <section className='flex gap-8 max-sm:flex-col'>
            <div className="companion-section">
                <div className="companion-avataqr" style={{backgroundColor: getSubjectColor(subject)}}>
                    <div className={cn(... 'absolute transition-opacity duration-100', callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' :
                         callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse')}>
                            <Image src={`/icons/${subject}.svg`} alt={subject} className='max-sm:w-fit'/>
                    </div>
                    <div className={cn(... 'absolute transition-opacity duration-100', callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
                        <Lottie lottieRef={lottieRef} animationData={soundwaves} autoplay={false} className='copmanion-lottie'/>
                    </div>
                </div>
                <p className='font-bold text-2xl'>{name}</p>
            </div>

            <div className="user-section">
                <div className="user-avatar">
                    <Image src={userImage} alt={userName} width={130} height={130} className='rounded-lg'/>
                    <p className='font-black text-2xl'>{userName}</p>
                </div>

                <button className='btn-mic' onClick={toggleMicrophone} disabled={callStatus === CallStatus.ACTIVE}>
                    <Image src={isMuted ? '/icons/mic-off.svg' :'/icons/mic-on.svg'} alt='mic' width={36} height={36}/>
                    <p className='max-sm:hidden' >{isMuted ? 'Turn on microphone': "Turn off microphone"}</p>
                </button>

                <button className={cn(... 'rounded-lg py-2 cursor-pointer transition-colors w-full text-white', 
                    callStatus === CallStatus.ACTIVE ? 'bg-red-500' : 'bg-primary',
                    callStatus === CallStatus.CONNECTING && 'annimate-pulse' )} onClick={callStatus === CallStatus.ACTIVE ? handleDiconnect : handleCall}>
                    {callStatus === CallStatus.ACTIVE ? "End session" : callStatus === CallStatus.CONNECTING ? 'Connecting' : 'Start Session'}
                </button>
            </div>
        </section>

        <section className='transcript'>
            <div className="transcript no-scrollbar">
                {Messages.map((message, index) => {
                    if (message.role === 'assistant') {
                       return( <p key={index} className='max-sm:text-sm'>
                            {name.split(' ')[0].replace('/[.,]/g,', '')} : {message.content}
                        </p>)
                    }else{
                      return(  <p key={index} className='text-primary max-sm:text-sm'>
                        {userName } : {message.content}
                      </p>)
                    }
                })}
            </div>

            <div className='transcript-fade'/>
        </section>
    </section>
  )
}

export default CompanionComponent