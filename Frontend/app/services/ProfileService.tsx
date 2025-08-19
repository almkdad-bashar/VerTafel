import axios, { AxiosError } from "axios";
import { ExtendTafelIdData, JwtResponse, ResponseData, UserData } from "../utils/Interfaces";
import alert from "../utils/Alert";
import { _URL } from "../Config";
import moment from "moment";

export async function changePassword(
    oldPassword: string,
    newPassword: string,
    jwtResponse: JwtResponse,
    token: string
): Promise<string> {
    const url = `${_URL}api/v1/user/changePassword`;
    const data = {
        oldPassword,
        newPassword,
        jwtResponse: {
            id: jwtResponse.id,
            username: jwtResponse.username,
            email: jwtResponse.email,
            roles: jwtResponse.roles,
            accessToken: token,
            tokenType: jwtResponse.tokenType
        }
    };

    try {
        const result = await axios.post<ResponseData>(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        return result.data.message;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error occurred while changing password:', error.message);
            alert('error', 'Check your connection');
        } else {
            console.error('Unexpected error occurred:', error);
        }
        return '';
    }
}

export async function extendTafelId(
    selectedFile: File, // Ensure this is a File object
    adultNumber: number,
    childrenNumber: number,
    token: string,
    jwtResponse: JwtResponse
) {
    const formData = new FormData();

    // Prepare the data object for 'jwtResponse'
    const data = {
        id: jwtResponse.id,
        username: jwtResponse.username,
        email: jwtResponse.email,
        roles: jwtResponse.roles,
        accessToken: token,
        tokenType: jwtResponse.tokenType
    };

    // Append the file and additional data to FormData
    formData.append('file', selectedFile, selectedFile.name); // Ensure selectedFile is a File object
    formData.append('adultNumber', adultNumber.toString());
    formData.append('childrenNumber', childrenNumber.toString());
    formData.append('jwtResponse', JSON.stringify(data));

    try {
        const response = await axios.post(
            `${_URL}api/v1/user/extendTafelId`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error extending Tafel ID:', error.message);
        } else {
            console.error('Unexpected error occurred:', error);
        }
        throw error;
    }
}

export async function getUserInfo(
    token: string,
    jwtResponse: JwtResponse
): Promise<UserData | null> {
    const url = `${_URL}api/v1/user/getUserInfo`;
    const data = {
        jwtResponse: {
            id: jwtResponse.id,
            username: jwtResponse.username,
            email: jwtResponse.email,
            roles: jwtResponse.roles,
            accessToken: token,
            tokenType: jwtResponse.tokenType
        }
    };

    try {
        const result = await axios.post<UserData>(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        return result.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error occurred while changing password:', error.message);
            alert('error', 'Check your connection');
        } else {
            console.error('Unexpected error occurred:', error);
        }
        return null;
    }
}


export async function vertifyQrCode(selectedFile: File, token: string, jwtResponse: JwtResponse) {
    const formData = new FormData();

    // Prepare the data object for 'jwtResponse'
    const data = {
        id: jwtResponse.id,
        username: jwtResponse.username,
        email: jwtResponse.email,
        roles: jwtResponse.roles,
        accessToken: token,
        tokenType: jwtResponse.tokenType
    };

    // Append the file and additional data to FormData
    formData.append('file', selectedFile, selectedFile.name);
    // formData.append('jwtResponse', JSON.stringify(data));
    formData.append('date', moment().format('DD.MM.YYYY'));

    try {
        const response = await axios.post<ResponseData>(
            `${_URL}api/v1/qrcode/verifyQrCode`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error extending QrCode Verification:', error.message);
        } else {
            console.error('Unexpected error occurred:', error);
        }
        throw error;
    }
}