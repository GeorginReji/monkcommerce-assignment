import * as React from 'react';
import Input, { InputProps } from '@mui/joy/Input';

type DebounceProps = {
	handleDebounce: (value: string) => void;
	debounceTimeout: number;
};

export default function DebounceInput(props: InputProps & DebounceProps) {
	const { handleDebounce, debounceTimeout, ...other } = props;

	const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined
	);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			handleDebounce(event.target.value);
		}, debounceTimeout);
	};

	return <Input {...other} onChange={handleChange} />;
}
