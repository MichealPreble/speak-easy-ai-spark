
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Clock } from "lucide-react";
import { SpeechAnalysisResult } from "@/utils/speech/types";

interface SessionsTableProps {
  data: SpeechAnalysisResult[];
}

const SessionsTable: React.FC<SessionsTableProps> = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><CalendarIcon className="h-4 w-4" /></TableHead>
          <TableHead>Clarity</TableHead>
          <TableHead>Pace</TableHead>
          <TableHead>Rhythm</TableHead>
          <TableHead>Hesitations</TableHead>
          <TableHead>Fillers</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'N/A'}
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    item.clarity.rating === 'excellent' ? 'bg-green-500' :
                    item.clarity.rating === 'good' ? 'bg-blue-500' :
                    item.clarity.rating === 'fair' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  {item.clarity.score.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mt-1 capitalize">
                  {item.clarity.rating}
                </div>
              </TableCell>
              <TableCell>
                {item.pace.toFixed(0)} WPM
                <div className="text-xs text-muted-foreground mt-1">
                  {item.pace < 120 ? 'Slow' : item.pace > 160 ? 'Fast' : 'Good'}
                </div>
              </TableCell>
              <TableCell>
                {item.rhythmScore.toFixed(1)}
                <div className="text-xs text-muted-foreground mt-1">
                  {item.rhythmScore >= 8 ? 'Excellent' : 
                   item.rhythmScore >= 6 ? 'Good' : 
                   item.rhythmScore >= 4 ? 'Fair' : 'Poor'}
                </div>
              </TableCell>
              <TableCell>{item.hesitationCount}</TableCell>
              <TableCell>{item.fillerWordCount}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
              No speech analysis data available for this timeframe.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SessionsTable;
