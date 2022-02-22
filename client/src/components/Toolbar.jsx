import React, { useState } from 'react'
import { ReactComponent as BrushSVG } from '../assets/img/pencil-outline.svg'
import { ReactComponent as LineSVG } from '../assets/img/line.svg'
import { ReactComponent as SquareSVG } from '../assets/img/square-sharp.svg'
import { ReactComponent as EllipseSVG } from '../assets/img/ellipse.svg'
import { ReactComponent as EraserSVG } from '../assets/img/eraser.svg'
import { ReactComponent as PaletteSVG } from '../assets/img/color-palette.svg'
import { ReactComponent as UndoSVG } from '../assets/img/arrow-undo-circle.svg'
import { ReactComponent as RedoSVG } from '../assets/img/arrow-redo-circle.svg'
import { ReactComponent as SaveSVG } from '../assets/img/save-sharp.svg'
import canvasState from '../store/canvasState'
import toolState from '../store/toolState'
import Brush from '../tools/Brush'
import Rect from '../tools/Rect'
import Eraser from '../tools/Eraser'
import { ChromePicker } from 'react-color';

const Toolbar = () => {
	const [isModal, setIsModal] = useState(false)
	const [colorPiker, setColorPicker] = useState('#fff')


	const changeColor = color => {
		toolState.setFillColor(color)
		toolState.setStrokeColor(color)
	}

	const downloadHandler = () => {
		// Костыльный способ скачать картинку
		const dataUrl = canvasState.canvas.toDataURL()
		const a = document.createElement('a')
		a.href = dataUrl
		a.download = canvasState.sessionid + '.jpg'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	}

	return (
		<div className="toolbar">
			<div className="container">
				<div className="toolbar-group1">
					<BrushSVG className="toolbar-button" onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionid))} />
					<LineSVG className="toolbar-button" />
					<SquareSVG className="toolbar-button" onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionid))} />
					<EllipseSVG className="toolbar-button" />
					<EraserSVG className="toolbar-button" onClick={() => toolState.setTool(new Eraser(canvasState.canvas))} />
					<div>
						<PaletteSVG className="toolbar-button" onClick={() => setIsModal(!isModal)} />
						{
							isModal
							&&
							<ChromePicker
								className='toolbar-button__colorpicker'
								disableAlpha
								color={colorPiker}
								onChange={color => {
									setColorPicker(color)
									changeColor(color.hex)
									}
								}
							/>
						}
					</div>
				</div>
				<div className="toolbar-group2">
					<UndoSVG className="toolbar-button" onClick={() => canvasState.undo()} />
					<RedoSVG className="toolbar-button" onClick={() => canvasState.redo()} />
					<SaveSVG className="toolbar-button" onClick={() => downloadHandler()} />
				</div>
			</div>
		</div>
	)
}

export default Toolbar