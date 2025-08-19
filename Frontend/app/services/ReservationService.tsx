import axios, { AxiosError } from "axios";
import { JwtResponse, ResponseData, ResponseGetCurrentNum, ResponseGetResDateList, ResponsePeekNumber, ResponsePeekQrCode } from "../utils/Interfaces";
import alert from "../utils/Alert";
import { format, parseISO } from "date-fns";
import { _URL } from "../Config";
import { Buffer } from 'buffer'; // Import buffer for handling binary data

export async function setCurrentNum(date: string, jwtResponse: JwtResponse, token: String, currentNum: number): Promise<void> {
    const url = `${_URL}api/v1/reservation/setCurrentNum`;
    const data = {
        date: date,
        currentNumber: currentNum,
        jwtResponse: {
            id: jwtResponse.id,
            username: jwtResponse.username,
            email: jwtResponse.email,
            roles: jwtResponse.roles,
            accessToken: token,
            tokenType: jwtResponse.tokenType
        },
    };

    try {
        console.log(data);
        const result = await axios.post<any>(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json' // Ensure client expects JSON responses
            },
        });
        console.log(result);
    } catch (error) {
        console.error('Error occurred while setting current number:', error);
        alert('error', 'checkout your connection')
    }
}


export async function peekQrCode(date: string, jwtResponse: JwtResponse, token: string): Promise<string> {
    const url = `${_URL}api/v1/reservation/peekQrCode`;
    const data = {
        date: date,
        jwtResponse: {
            id: jwtResponse.id,
            username: jwtResponse.username,
            email: jwtResponse.email,
            roles: jwtResponse.roles,
            accessToken: token,
            tokenType: jwtResponse.tokenType
        },
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'image/png' // Expect image/png in the response
            },
            responseType: 'arraybuffer' // This tells Axios to treat the response as binary data
        });

        // Convert arraybuffer to base64 string
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const imageUrl = `data:image/png;base64,${base64}`;

        return imageUrl; // This is a data URL that can be used to display the image
    } catch (error) {
        console.error('Error fetching QR code:', error);
        return '';
    }
}

export async function peekNumber(date: string, jwtResponse: JwtResponse, token: String): Promise<number> {
    const url = `${_URL}api/v1/reservation/peekNumber`;
    const data = {
        date: date,
        jwtResponse: {
            id: jwtResponse.id,
            username: jwtResponse.username,
            email: jwtResponse.email,
            roles: jwtResponse.roles,
            accessToken: token,
            tokenType: jwtResponse.tokenType
        },
    };
    try {
        const result = await axios.post<ResponsePeekNumber>(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json' // Ensure client expects JSON responses
            },
        });
        console.log("result", result);
        return result.data.number;
    } catch (error) {
        return -1;
    }
}

export async function deleteReservation(date: string, jwtResponse: JwtResponse, token: String): Promise<string> {
    const url = `${_URL}api/v1/reservation/deleteReservation`;
    const data = {
        date: date,
        jwtResponse: {
            id: jwtResponse.id,
            username: jwtResponse.username,
            email: jwtResponse.email,
            roles: jwtResponse.roles,
            accessToken: token,
            tokenType: jwtResponse.tokenType
        },
    };
    try {
        const result = await axios.post<ResponseData>(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        });
        return result.data.message;
    } catch (error) {
        return "error in connecting with server";
    }
}

export async function getResDateList(date: string, jwtResponse: JwtResponse, token: String): Promise<string[]> {
    const url = `${_URL}api/v1/reservation/getResDateList`;
    const data = {
        date: date,
        jwtResponse: {
            id: jwtResponse.id,
            username: jwtResponse.username,
            email: jwtResponse.email,
            roles: jwtResponse.roles,
            accessToken: token,
            tokenType: jwtResponse.tokenType
        },
    };
    try {
        const result = await axios.post<ResponseGetResDateList>(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        });
        console.log("result", result);
        return result.data.dateList;
    } catch (error) {
        return [];
    }
}


export async function getCurrentNum(date: string, jwtResponse: JwtResponse, token: String): Promise<number> {
    const url = `${_URL}api/v1/reservation/getCurrentNum`;
    const data = {
        date: date,
        jwtResponse: {
            id: jwtResponse.id,
            username: jwtResponse.username,
            email: jwtResponse.email,
            roles: jwtResponse.roles,
            accessToken: token,
            tokenType: jwtResponse.tokenType
        },
    };
    try {
        const result = await axios.post<ResponseGetCurrentNum>(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json' // Ensure client expects JSON responses
            },
        });
        console.log("result", result);
        return result.data.currentNum;
    } catch (error) {
        return -1;
    }
}


export async function book(selectedStartDate: string, jwtResponse: JwtResponse, token: String) {
    if (!selectedStartDate) {
        alert('Error', 'Please select a date!');
        return;
    }

    if (jwtResponse == null) {
        alert('Error', 'There is an authentication error');
        return;
    }

    const parsedDate = parseISO(selectedStartDate);
    const date = format(parsedDate, 'dd.MM.yyyy');

    const url = `${_URL}api/v1/reservation/book`;
    const data = {
        date: date,
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
        const result = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json' // Ensure client expects JSON responses
            },
        });
        alert('Success', result.data.message);
        return result.data.message;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const errorPayload = JSON.stringify(error.response.data, null, 2);
                alert(
                    'Error',
                    `Payload: ${errorPayload}`
                );
            } else if (error.request) {
                // Request was made but no response received
                alert('Error', 'No response received from the server');
            } else {
                // Something else went wrong in setting up the request
                alert('Error', error.message);
            }
        } else {
            alert('Error', 'An unexpected error occurred');
        }
    }
}


export async function setAvailableNumber(selectedDate: string, jwtResponse: JwtResponse, token: String, number: string) {
    const url = `${_URL}api/v1/reservation/setAvailableNum`;
    const parsedDate = parseISO(selectedDate);
    const date = format(parsedDate, 'dd.MM.yyyy');
    const data = {
        totalNumber: parseInt(number),
        date: date,
        jwtResponse: {
            id: jwtResponse.id,
            username: jwtResponse.username,
            email: jwtResponse.email,
            roles: jwtResponse.roles,
            accessToken: token,
            tokenType: jwtResponse.tokenType
        }
    };
    console.log(data);

    try {
        const result = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json' // Ensure client expects JSON responses
            },
        });
        alert('Success', result.data.message);
        return result.data.message;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const errorPayload = JSON.stringify(error.response.data, null, 2);
                alert(
                    'Error',
                    `Payload: ${errorPayload}`
                );
            } else if (error.request) {
                // Request was made but no response received
                alert('Error', 'No response received from the server');
            } else {
                // Something else went wrong in setting up the request
                alert('Error', error.message);
            }
        } else {
            alert('Error', 'An unexpected error occurred');
        }
    }
}