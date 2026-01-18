import { useState, useRef, useEffect } from 'react';

export default function VoiceInput({ onTranscript, language = 'en-US' }) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore errors on cleanup
                }
            }
        };
    }, []);

    const initializeRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Speech Recognition not supported in this browser.\n\nSupported browsers:\n- Chrome/Edge\n- Safari\n\nNote: Firefox has limited support.');
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
            setTranscript('');
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                console.log('Final transcript:', finalTranscript);
                setTranscript(finalTranscript);
                onTranscript(finalTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);

            // Handle specific errors
            if (event.error === 'not-allowed') {
                const isLocalhost = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '[::1]';
                const isHttps = window.location.protocol === 'https:';

                let message = 'Microphone access denied.\n\n';

                if (!isLocalhost && !isHttps) {
                    message += '⚠️ You are accessing this site over HTTP (not localhost).\n';
                    message += 'Microphone access requires:\n';
                    message += '• localhost/127.0.0.1 (for development), OR\n';
                    message += '• HTTPS (for production)\n\n';
                }

                message += 'Please check:\n';
                message += '1. Allow microphone access when prompted\n';
                message += '2. Check browser permissions (click lock icon in address bar)\n';
                message += '3. Ensure microphone is not being used by another app';

                alert(message);
            } else if (event.error === 'no-speech') {
                console.log('No speech detected');
            } else if (event.error !== 'aborted') {
                alert(`Speech recognition error: ${event.error}`);
            }

            setIsListening(false);
            recognitionRef.current = null; // Reset on error
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);
            recognitionRef.current = null; // Reset after ending
        };

        return recognition;
    };

    const startListening = () => {
        try {
            // Stop any existing recognition
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore
                }
                recognitionRef.current = null;
            }

            // Create new recognition instance
            recognitionRef.current = initializeRecognition();

            if (recognitionRef.current) {
                recognitionRef.current.start();
            }
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            alert('Failed to start voice input. Please try again.');
            setIsListening(false);
            recognitionRef.current = null;
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error('Error stopping speech recognition:', error);
            }
        }
        setIsListening(false);
    };

    return (
        <button
            onClick={isListening ? stopListening : startListening}
            className={`voice-input-btn ${isListening ? 'listening' : ''}`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
            aria-label="Voice input"
            type="button"
        >
            <i className={`ph-fill ${isListening ? 'ph-microphone-slash' : 'ph-microphone'}`}></i>
        </button>
    );
}
