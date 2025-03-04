type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface HttpOptions {
  headers?: { [key: string]: string };
  body?: any;
  baseUrl?: string;
  token?: string;
}

//cái xài chính
// const defaultBaseUrl = 'https://koinebackend.site/api'

//cái xài tạm
// const defaultBaseUrl = 'https://capstone-project-be-bqa5.onrender.com/api'

//local may quan
const defaultBaseUrl = "http://172.16.12.41:8080/api";

//local may lap dao
// const defaultBaseUrl = 'http://172.16.12.104:8080/api'

//mới
const request = async <Response>(
  method: HttpMethod,
  url: string,
  options?: HttpOptions
): Promise<Response> => {
  const { headers, body, baseUrl, token } = options || {};

  let formattedBody: FormData | string | undefined = undefined;
  if (body instanceof FormData) {
    formattedBody = body;
  } else if (body) {
    formattedBody = JSON.stringify(body);
  }

  const baseHeaders: { [key: string]: string } =
    formattedBody instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };

  // Tạo headers chính thức, nếu có token thì thêm Authorization
  const combinedHeaders: { [key: string]: string } = {
    ...baseHeaders,
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fullUrl = `${baseUrl || defaultBaseUrl}/${url}`;

  const response = await fetch(fullUrl, {
    method,
    headers: combinedHeaders, // Đây là đối tượng headers hợp lệ
    body: formattedBody, // Chỉ gửi body nếu là DELETE và có body
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<HttpOptions, "body">
  ): Promise<Response> {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<HttpOptions, "body">
  ): Promise<Response> {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<HttpOptions, "body">
  ): Promise<Response> {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<HttpOptions, "body"> // Thêm body vào HttpOptions
  ): Promise<Response> {
    return request<Response>("DELETE", url, { ...options, body }); // Gửi cả body và headers
  },
};

export default http;

export const parseCurrency = (amount: string | number): number => {
  if (typeof amount === "string") {
    // Remove the decimal part and parse the integer part
    const integerPart = amount.split(".")[0];
    return parseFloat(integerPart.replace(/,/g, ""));
  }
  return amount;
};

export const formatCurrency = (amount: string | number) => {
  const parsedAmount = parseCurrency(amount);
  return parsedAmount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
