import { toast } from "react-toastify";
import { auth, provider } from "../Authentication/FirebaseConfig";
import { userCreateOrUpdate } from "./AuthService";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { createUserPayloadAndDispatch, removeUserAndDispatch } from "./ReduxService";

const getUserData = function (user) {
    return {
        email: user.email,
        displayName: user.displayName,
        photoUrl: user.photoURL
    };
}

export const googleLogin = async (dispatch) => {

    signInWithPopup(auth, provider)
        .then(async (result) => {
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            const user = result.user;
            const userData = getUserData(user);
            const idTokenResult = await user.getIdTokenResult();

            userCreateOrUpdate(idTokenResult.token, userData)
                .then((res) => {
                    createUserPayloadAndDispatch(dispatch, idTokenResult.token, res);
                })
                .catch();

            toast.success(
                `Hi ${user.displayName}, Welcome to GetVehicle again!`
            );

        }).catch((error) => {
            const credential = GoogleAuthProvider.credentialFromError(error);
        });

};

export const googleLogout = async (dispatch) => {
    signOut(auth).then(() => {
        removeUserAndDispatch(dispatch);
    }).catch((error) => {
        
    });
}