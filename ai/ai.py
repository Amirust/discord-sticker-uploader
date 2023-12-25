from ultralytics import YOLO
import sys

args = sys.argv
if len(args) < 3:
    print('Usage: python3 ai.py <pytorch file> <name of input file> [images, ...]')
    sys.exit(1)

pytorch_file = args[1]
output_file = args[2]
images = args[3:]

model = YOLO(pytorch_file)

if __name__ == "__main__":
    result = model.predict(images, boxes=False)
    for i in range(len(result)):
        result[i].save_txt(output_file + '_' + str(i) + '.txt')
