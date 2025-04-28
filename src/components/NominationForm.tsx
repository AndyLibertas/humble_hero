import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, UserIcon, HeartIcon, MailIcon, TrophyIcon, CheckCircleIcon, BotIcon } from 'lucide-react';
type MessageType = 'system' | 'user' | 'image';
interface Message {
  id: string;
  type: MessageType;
  content: string | React.ReactNode;
  timestamp: Date;
  isImage?: boolean;
}
type ChatStep = 'intro' | 'nomineeName' | 'nomineeValues' | 'nominatorName' | 'nominatorEmail' | 'confirmation' | 'thanks';


const submitNomination = async (formData: typeof formState) => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://libertas-back-end.onrender.com";

  try {
    const response = await fetch(`${baseUrl}/humble_hero`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit nomination");
    }

    const result = await response.json();
    console.log("Nomination submitted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error submitting nomination:", error);
    throw error;
  }
};


export const NominationForm = () => {
  const [formState, setFormState] = useState({
    nomineeName: '',
    nomineeValues: '',
    nominatorName: '',
    nominatorEmail: '',
    submitted: false
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState<ChatStep>('intro');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const companyValues = ['Integrity', 'Teamwork', 'Innovation', 'Excellence', 'Customer Focus', 'Accountability', 'Respect', 'Passion'];
  const maintainFocus = () => {
    if (inputRef.current && currentStep !== 'confirmation' && currentStep !== 'thanks') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
    maintainFocus();
  }, [messages]);
  useEffect(() => {
    const timer = setTimeout(() => {
      addImageMessage("/Image_%286%29.jpg");
      setTimeout(() => {
        addSystemMessage("👋 Hi there! I'm Marion Humble Helper, your nomination assistant.");
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addSystemMessage("I'll help you nominate someone for our Humble Hero Award. Ready to begin?");
            setTimeout(() => {
              setCurrentStep('nomineeName');
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                addSystemMessage('Who would you like to nominate for the Humble Hero Award?');
                maintainFocus();
              }, 1500);
            }, 1000);
          }, 2000);
        }, 1000);
      }, 1000);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const addSystemMessage = (content: string | React.ReactNode) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };
  const addImageMessage = (imageUrl: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'image',
      content: <div className="flex flex-col items-center">
          <motion.img src={`/humble_hero_trophy.jpg`} alt="Humble Hero Trophy" className="h-40 w-auto object-contain rounded-lg" initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1,
          y: [0, -5, 0]
        }} transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          },
          opacity: {
            duration: 0.5
          },
          scale: {
            duration: 0.5
          }
        }} />
          <motion.p className="text-sm text-gray-500 mt-2" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.3
        }}>
            The Humble Hero Award
          </motion.p>
        </div>,
      timestamp: new Date(),
      isImage: true
    };
    setMessages(prev => [...prev, newMessage]);
  };
  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentInput.trim() && currentStep !== 'confirmation') return;
    if (currentInput.trim()) {
      addUserMessage(currentInput);
    }
    switch (currentStep) {
      case 'nomineeName':
        setFormState(prev => ({
          ...prev,
          nomineeName: currentInput
        }));
        handleNomineeNameSubmitted(currentInput);
        break;
      case 'nomineeValues':
        setFormState(prev => ({
          ...prev,
          nomineeValues: currentInput
        }));
        handleNomineeValuesSubmitted(currentInput);
        break;
      case 'nominatorName':
        setFormState(prev => ({
          ...prev,
          nominatorName: currentInput
        }));
        handleNominatorNameSubmitted(currentInput);
        break;
      case 'nominatorEmail':
        setFormState(prev => ({
          ...prev,
          nominatorEmail: currentInput
        }));
        handleNominatorEmailSubmitted(currentInput);
        break;
      case 'confirmation':
        handleConfirmation();
        break;
    }
    setCurrentInput('');
    maintainFocus();
  };
  const handleValueSelect = (value: string) => {
    let updatedValues = formState.nomineeValues;
    if (updatedValues) {
      updatedValues += updatedValues.endsWith(',') ? ` ${value}` : `, ${value}`;
    } else {
      updatedValues = value;
    }
    setFormState(prev => ({
      ...prev,
      nomineeValues: updatedValues
    }));
    setCurrentInput(updatedValues);
    setShowQuickReplies(false);
    maintainFocus();
  };
  const handleNomineeNameSubmitted = (name: string) => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addSystemMessage(`Great! ${name} sounds like an excellent nominee. 🌟`);
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addSystemMessage('What values does this person display that make them a Humble Hero?');
            setCurrentStep('nomineeValues');
            setShowQuickReplies(true);
            maintainFocus();
          }, 1500);
        }, 1000);
      }, 1500);
    }, 500);
  };
  const handleNomineeValuesSubmitted = (values: string) => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addSystemMessage(`Those are wonderful qualities! Thanks for recognizing these values in your nominee. 💯`);
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addSystemMessage('Now, could you tell me your name?');
            setCurrentStep('nominatorName');
            maintainFocus();
          }, 1500);
        }, 1000);
      }, 1500);
    }, 500);
  };
  const handleNominatorNameSubmitted = (name: string) => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addSystemMessage(`Nice to meet you, ${name}! 👋`);
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addSystemMessage("Last step! What's your email address? We'll keep you updated on the nomination.");
            setCurrentStep('nominatorEmail');
            maintainFocus();
          }, 1500);
        }, 1000);
      }, 1500);
    }, 500);
  };
  const handleNominatorEmailSubmitted = (email: string) => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addSystemMessage("Perfect! I've collected all the information needed for your nomination.");
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const summary = <div className="space-y-2">
                <p className="font-medium">
                  Here's a summary of your nomination:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <span className="font-medium">Nominee:</span>{' '}
                    {formState.nomineeName}
                  </li>
                  <li>
                    <span className="font-medium">Values displayed:</span>{' '}
                    {formState.nomineeValues}
                  </li>
                  <li>
                    <span className="font-medium">Nominated by:</span>{' '}
                    {formState.nominatorName}
                  </li>
                  <li>
                    <span className="font-medium">Contact email:</span>{' '}
                    {formState.nominatorEmail}
                  </li>
                </ul>
                <p className="mt-3">
                  Would you like to submit this nomination?
                </p>
              </div>;
            addSystemMessage(summary);
            setCurrentStep('confirmation');
          }, 1800);
        }, 1000);
      }, 1500);
    }, 500);
  };
  const handleConfirmation = async () => {
    setFormState((prev) => ({
      ...prev,
      submitted: true,
    }));
  
    try {
      await submitNomination(formState);
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addSystemMessage(
            <div className="space-y-3">
              <div className="flex items-center justify-center mb-2">
                <CheckCircleIcon className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-lg font-medium">Nomination Submitted!</span>
              </div>
              <p>
                Thank you for taking the time to recognize a colleague's
                contributions. Your nomination has been received.
              </p>
            </div>
          );
          setCurrentStep("thanks");
          setTimeout(() => {
            setFormState({
              nomineeName: "",
              nomineeValues: "",
              nominatorName: "",
              nominatorEmail: "",
              submitted: false,
            });
            setMessages([]);
            setCurrentStep("intro");
          }, 5000);
        }, 1500);
      }, 500);
    } catch (error) {
      addSystemMessage(
        "There was an error submitting your nomination. Please try again later."
      );
      setFormState((prev) => ({
        ...prev,
        submitted: false,
      }));
    }
  };
  const renderMessage = (message: Message) => {
    const isSystem = message.type === 'system';
    const isUser = message.type === 'user';
    const isImage = message.type === 'image';
    if (isImage) {
      return <motion.div key={message.id} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="flex justify-center mb-6">
          {message.content}
        </motion.div>;
    }
    return <motion.div key={message.id} initial={{
      opacity: 0,
      y: 20,
      scale: 0.95
    }} animate={{
      opacity: 1,
      y: 0,
      scale: 1
    }} transition={{
      duration: 0.3
    }} className={`flex ${isSystem ? 'justify-start' : 'justify-end'} mb-4`}>
        {isSystem && <div className="h-8 w-8 rounded-full bg-navy-blue flex items-center justify-center mr-3 mt-1 flex-shrink-0">
            <BotIcon className="h-5 w-5 text-white" />
          </div>}
        <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${isSystem ? 'bg-navy-blue text-white rounded-tl-none' : 'bg-blue-100 text-gray-800 rounded-tr-none'}`}>
          {message.content}
        </div>
        {isUser && <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ml-3 mt-1 flex-shrink-0">
            <UserIcon className="h-5 w-5 text-white" />
          </div>}
      </motion.div>;
  };
  const renderTypingIndicator = () => {
    return <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="flex justify-start mb-4">
        <div className="h-8 w-8 rounded-full bg-navy-blue flex items-center justify-center mr-3 mt-1">
          <BotIcon className="h-5 w-5 text-white" />
        </div>
        <div className="bg-navy-blue text-white rounded-2xl rounded-tl-none px-5 py-3">
          <div className="flex space-x-1">
            <motion.div animate={{
            y: [0, -5, 0]
          }} transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 0.1
          }} className="h-2 w-2 bg-white rounded-full" />
            <motion.div animate={{
            y: [0, -5, 0]
          }} transition={{
            duration: 0.6,
            delay: 0.2,
            repeat: Infinity,
            repeatDelay: 0.1
          }} className="h-2 w-2 bg-white rounded-full" />
            <motion.div animate={{
            y: [0, -5, 0]
          }} transition={{
            duration: 0.6,
            delay: 0.4,
            repeat: Infinity,
            repeatDelay: 0.1
          }} className="h-2 w-2 bg-white rounded-full" />
          </div>
        </div>
      </motion.div>;
  };
  const renderQuickReplies = () => {
    return <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: 0.2
    }} className="flex flex-wrap gap-2 mb-4">
        {companyValues.map(value => <motion.button key={value} whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }} onClick={() => handleValueSelect(value)} className="bg-blue-100 hover:bg-blue-200 text-navy-blue font-medium px-4 py-2 rounded-full text-sm transition-colors duration-200">
            {value}
          </motion.button>)}
      </motion.div>;
  };
  const InputField = () => {
    if (currentStep === 'thanks') return null;
    const isConfirmStep = currentStep === 'confirmation';
    return <form onSubmit={handleSubmit} className="mt-4">
        {!isConfirmStep ? <div className="flex items-center bg-white rounded-full border border-gray-300 pr-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-300">
            <input ref={inputRef} type={currentStep === 'nominatorEmail' ? 'email' : 'text'} value={currentInput} onChange={e => setCurrentInput(e.target.value)} placeholder={currentStep === 'nomineeName' ? "Enter nominee's name..." : currentStep === 'nomineeValues' ? 'Describe their values...' : currentStep === 'nominatorName' ? 'Enter your name...' : currentStep === 'nominatorEmail' ? 'Enter your email...' : ''} className="flex-1 py-3 px-4 bg-transparent outline-none rounded-full" required={currentStep !== 'confirmation'} autoFocus />
            <motion.button type="submit" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="h-10 w-10 rounded-full bg-navy-blue flex items-center justify-center text-white">
              <SendIcon className="h-5 w-5" />
            </motion.button>
          </div> : <div className="flex gap-3 justify-center">
            <motion.button type="submit" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="py-3 px-6 rounded-full bg-navy-blue text-white font-medium flex items-center gap-2" onClick={handleSubmit}>
              <span>Submit Nomination</span>
              <SendIcon className="h-5 w-5" />
            </motion.button>
          </div>}
      </form>;
  };
  return <div className="max-w-4xl mx-auto">
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.8
    }} className="relative flex flex-col items-center mb-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div initial={{
          scale: 0,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 0.07
        }} transition={{
          duration: 1,
          delay: 0.2
        }} className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-navy-blue to-blue-300" />
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 0.5
        }} transition={{
          duration: 1,
          delay: 0.5
        }} className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(10, 36, 99, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(10, 36, 99, 0.03) 0%, transparent 50%)'
        }} />
        </div>
        <motion.img src="/marion.png" alt="Marion Companies Logo" className="h-24 w-auto mb-6" initial={{
        y: -30,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        duration: 0.6
      }} />
        <div className="text-center max-w-2xl mx-auto px-4 mb-6">
          <motion.h2 className="text-navy-blue text-3xl font-bold mb-2" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3,
          duration: 0.6
        }}>
            Humble Hero Award
          </motion.h2>
          <motion.p className="text-gray-600 text-lg" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5,
          duration: 0.6
        }}>
            Recognizing those who go above and beyond
          </motion.p>
        </div>
      </motion.div>
      <motion.div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-10 border border-gray-100" initial={{
      opacity: 0,
      y: 30
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.7,
      delay: 0.2
    }}>
        <div className="bg-gradient-to-r from-navy-blue to-blue-800 p-6 text-white">
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.4,
          duration: 0.6
        }} className="flex items-center">
            <div className="relative mr-4">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <TrophyIcon className="h-6 w-6 text-white" />
              </div>
              <motion.div className="absolute -right-1 -bottom-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white" animate={{
              scale: [1, 1.2, 1]
            }} transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse'
            }} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Marion Humble Helper</h2>
              <p className="text-blue-100 text-sm">Online • Ready to help</p>
            </div>
          </motion.div>
        </div>
        <div className="p-6 max-h-[500px] overflow-y-auto">
          <div className="space-y-1">
            {messages.map(renderMessage)}
            {isTyping && renderTypingIndicator()}
            {showQuickReplies && currentStep === 'nomineeValues' && renderQuickReplies()}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <InputField />
        </div>
      </motion.div>
      <motion.div className="mt-8 text-center text-gray-500 text-sm pb-8" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.8
    }}>
        <p>
          © {new Date().getFullYear()} Marion Companies. All rights reserved.
        </p>
      </motion.div>
    </div>;
};