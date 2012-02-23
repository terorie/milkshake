#! /usr/bin/python

import os
import sys
import re

def loadFile(name):
  return open(name, "r").read().replace("\\", "\\\\")


if len(sys.argv) < 2:
  sys.stderr.write("Please specifiy at least one file name")
  sys.exit(1)

file = sys.argv[1];
script = loadFile(file) 
itr = re.finditer(r"#import (.+)", script, re.I)
includes = []

for match in itr:
  includes.append((match.group(0), match.group(1)))

for match in includes:
  script = re.sub(match[0], loadFile(match[1]), script)
  
print script
