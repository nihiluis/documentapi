export interface paths {
    "/api/v1/file/download/{objectName}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Presigned Url */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    objectName: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successfully generated presigned URL */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PresignedUrlResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/file/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Upload File */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "multipart/form-data": {
                        /** Format: binary */
                        file?: Blob;
                    };
                };
            };
            responses: {
                /** @description File uploaded successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["FileUploadResponse"];
                    };
                };
                /** @description Bad request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ErrorResponse: {
            message?: string;
            /** Format: int32 */
            status?: number;
        };
        FileUploadResponse: {
            storedFilename?: string;
            originalFilename?: string;
            contentType?: string;
            /** Format: int64 */
            size?: number;
        };
        PresignedUrlResponse: {
            url?: string;
            objectName?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
