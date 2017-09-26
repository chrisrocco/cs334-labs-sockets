# IERG3310 Project
import socket
import random
import time


listenPort = 3310;
socket.setdefaulttimeout(120)
localhost = ''

print ("Robot started")

print ("")

# Create a TCP socket to listen connection
print ("Creating TCP socket...")
listenSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
listenSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
listenSocket.bind((localhost, listenPort))
listenSocket.listen(5)
print ("Done")

print ("\nTCP socket created, ready for listening and accepting connection...")
#print ("Waiting for connection on port %(listenPort)s") % locals()
print ("Waiting for connection on port"), listenPort

# accept connections from outside, a new socket is constructed
s1, address = listenSocket.accept()
studentIP = address[0]
print ("\nClient from", studentIP, "at port", address[1], "connected")
# Close the listen socket
# Usually you can use a loop to accept new connections
listenSocket.close()

data = s1.recv(100)
print ("Student ID received:", data)

iTCPPort2Connect = random.randint(0,9999) + 20000
print ("Requesting STUDENT to accept TCP <", iTCPPort2Connect, ">...")

s1.send(str(iTCPPort2Connect).encode())
print ("Done")

time.sleep(1)
print ("\nConnecting to the STUDENT s1 <", iTCPPort2Connect, ">...")

# Connect to the server (student s2)
s2 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s2.connect((studentIP,iTCPPort2Connect))

# Send the ports required to STUDENT
iUDPPortRobot = random.randint(0,9999) + 20000
iUDPPortStudent = random.randint(0,9999) + 20000
print ("Sending the UDP information: to ROBOT: <", iUDPPortRobot, ">, to STUDENT: <", iUDPPortStudent, ">...")

sudentUDPshit = str(iUDPPortRobot) + "," + str(iUDPPortStudent)
s2.send(sudentUDPshit.encode())
print ("Done")

# Create a UDP socket to send and receive data
print ("Preparing to receive x...")
addr = (localhost, iUDPPortRobot)
s3 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s3.bind(addr)

x, addr = s3.recvfrom(100)
print ("Get x =", x)

time.sleep(1)
print ("Sending UDP packets:")

messageToTransmit = ""
for i in range(0,int(x) * 2):
    messageToTransmit += str(random.randint(0,9999)).zfill(5)
print ("Message to transmit:", messageToTransmit)

messageToTransmit = messageToTransmit.encode()

for i in range(0,5):
    s3.sendto(messageToTransmit,(studentIP,iUDPPortStudent))
    time.sleep(1)
    print ("UDP packet", i+1, "sent")

print ("\nReceiving UDP packet:")
while True: # remove potentially duplicate msg
  data, addr = s3.recvfrom(int(x) * 10)
  if int(data) != int(x):
  	break

print ("Received: "), data

if messageToTransmit == data:
    print ("\nThe two strings are the same.")
else:
    print ("\nThe two strings are not the same.")

s1.close()
s2.close()
s3.close()
exit()
