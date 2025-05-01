import Footer from '../Components/HeadFoot/Footer';
import Form from '../Components/LSPage/Form'

export default function SignupView(){
    return(
        <div className='w-full min-h-screen flex flex-col bg-gray-100'>
            <div className="flex-grow flex items-center justify-center p-6">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
                    <Form formType="Signup"/>
                </div>
            </div>
            <Footer/>
        </div>
    );
    
}