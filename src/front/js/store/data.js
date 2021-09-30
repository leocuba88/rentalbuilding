import React from "react";
import { useAuth } from "./auth";

export const useQueryData = endpoint => {
	const [loading, setLoading] = React.useState(false);
	const [data, setData] = React.useState(null);
	const auth = useAuth();

	React.useEffect(
		() => {
			if (!data) {
				setLoading(true);
				fetch(process.env.BACKEND_URL + endpoint, {
					method: "GET",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
						...(auth.authToken ? { Authorization: "Bearer " + auth.authToken } : {})
					}
				})
					.then(resp => {
						if (resp.status !== 200) {
							throw new Error("authentication-error");
						}

						return resp.json();
					})
					.then(data => {
						console.log(endpoint, data);
						setData(data);
						setLoading(false);
					})
					.catch(() => {
						setLoading(false);
					});
			}
		},
		[loading, data]
	);

	const mutate = newdata => {
		setData(newdata);
	};

	return { loading, data, mutate };
};

export const useUpdateData = (endpoint, method = "POST") => {
	const [updating, setUpdating] = React.useState(false);
	const [updated, setUpdated] = React.useState(false);
	const auth = useAuth();
	const reset = () => {
		setUpdated(false);
		setUpdating(false);
	};

	const updateData = data => {
		setUpdating(true);
		fetch(process.env.BACKEND_URL + endpoint, {
			method: method,
			mode: "cors",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				...(auth.authToken ? { Authorization: "Bearer " + auth.authToken } : {})
			}
		}).then(resp => {
			setUpdating(false);
			if (resp.status === 200 || resp.status === 204) {
				setUpdated(true);
			} else {
				setUpdated(false);
			}
		});
	};

	return { updated, updating, updateData, reset };
};
