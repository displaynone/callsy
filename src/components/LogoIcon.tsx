import type { SvgProps } from "react-native-svg";
import {
	Defs,
	FeGaussianBlur,
	Filter,
	G,
	LinearGradient,
	Path,
	Rect,
	Stop,
	Svg,
} from "react-native-svg";

const VIEWBOX_WIDTH = 116;
const VIEWBOX_HEIGHT = 125;

export type LogoBorderlessProps = SvgProps & {
	size?: number;
};

export function LogoIcon(props: LogoBorderlessProps) {
	const { size, width, height, ...svgProps } = props;

	const resolvedWidth = width ?? size ?? VIEWBOX_WIDTH;
	const resolvedHeight =
		height ??
		(size != null
			? (Number(resolvedWidth) * VIEWBOX_HEIGHT) / VIEWBOX_WIDTH
			: VIEWBOX_HEIGHT);

	return (
		<Svg
			viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
			width={resolvedWidth}
			height={resolvedHeight}
			{...svgProps}
		>
			<G transform="translate(-46.314 -85.687)">
				<Path
					d="m103.74 85.692c-0.91278 0.03079-1.9286 0.1985-3.1053 0.58121v4.23e-4l-51.921 16.735c-2.0116 0.91337-2.5684 2.3558-2.36 4.0765 0.85682 36.664-0.41186 73.902 56.591 102.78 2.0354 0.77354 2.0913 0.13305 2.8391-0.0131 23.699-12.721 62.315-33.413 55.783-103.2-0.10972-1.4243-0.64076-2.5856-2.36-3.004l-51.492-17.329c-1.2182-0.35276-2.4535-0.68255-3.9748-0.63123zm-32.463 14.879c4.1237-0.13925 9.057 1.1765 10.738 6.4315l5.4077 16.117c2.4677 9.2474-2.9753 10.797-4.7353 11.446-1.76 0.64857-3.9396 1.8996-3.9396 1.8996-2.8668 1.3761-4.7604 5.2512-3.4597 10.177 1.3007 4.9257 10.089 17.568 11.774 19.082 1.6854 1.5143 4.7998 4.2503 9.767 1.4999l3.2113-2.3248c4.7507-3.5539 9.1105-1.5799 12.225 1.4698 3.1148 3.0497 12.443 11.798 14.259 13.883 1.8159 2.0853 5.7596 6.7952-0.79572 12.911-6.2896 6.8713-11.391 10.115-25.812 6.4412-14.421-3.6741-29.446-18.941-37.244-31.903-7.7983-12.962-15.521-38.52-7.8766-54.778 4.2541-8.5799 10.038-11.652 16.482-12.352z"
					fill="#0097a7"
				/>
			</G>
		</Svg>
	);
}
